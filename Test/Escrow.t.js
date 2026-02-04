const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow Contract", function () {
    let Escrow;
    let escrow;
    let buyer;
    let seller;
    let arbiter;
    let user;

    const TEN_ETH = ethers.utils.parseEther("10");

    beforeEach(async function () {
        [buyer, seller, arbiter, user] = await ethers.getSigners();
        Escrow = await ethers.getContractFactory("Escrow");
        escrow = await Escrow.deploy(seller.address, arbiter.address);
    });

    describe("Deployment", function () {
        it("Should set the correct seller, arbiter, buyer and initial state", async function () {
            expect(await escrow.buyer()).to.equal(buyer.address);
            expect(await escrow.seller()).to.equal(seller.address);
            expect(await escrow.arbiter()).to.equal(arbiter.address);
            expect(await escrow.getStatus()).to.equal(0);
            expect(await escrow.amount()).to.equal(0);
        });

        it("Should revert if seller is zero address", async function () {
            const Escrow = await ethers.getContractFactory("Escrow");

            await expect(Escrow.deploy(ethers.constants.AddressZero, arbiter.address)).to.be.reverted;
        });

        it("Should revert if arbiter is zero address", async function () {
            const Escrow = await ethers.getContractFactory("Escrow");

            await expect(Escrow.deploy(seller.address, ethers.constants.AddressZero)).to.be.reverted;
        });
    });

    describe("Deposit", function () {
        it("Should allow buyer to deposit funds into escrow", async function () {
            expect(await escrow.deposit({ value: TEN_ETH })).to.emit(escrow, "Deposited").withArgs(buyer.address, TEN_ETH);
            expect(await escrow.amount()).to.equal(TEN_ETH);
            expect(await escrow.getStatus()).to.equal(1);
            expect(await ethers.provider.getBalance(escrow.address)).to.equal(TEN_ETH);
        });

        it("Should revert if non buyer tries to deposit", async function () {
            await expect(escrow.connect(user).deposit({ value: TEN_ETH })).to.be.revertedWithCustomError(escrow, "NotBuyer");
        });

        it("Should revert if deposit amount is zero", async function () {
            await expect(escrow.connect(buyer).deposit({ value: 0 })).to.be.revertedWithCustomError(escrow, "ZeroAmount");
        });

        it("Should revert if deposit is made when funds are already deposited", async function () {
            await escrow.connect(buyer).deposit({ value: TEN_ETH });

            await expect(escrow.connect(buyer).deposit({ value: TEN_ETH })).to.be.revertedWithCustomError(escrow, "InvalidState");
        });
    });

    describe("Delivery Confirmation", function () {
        it("Should set status delivered and emit Delivered event", async function () {
            await escrow.connect(buyer).deposit({ value: TEN_ETH });

            await expect(escrow.connect(seller).confirmDelivery()).to.emit(escrow, "Delivered").withArgs(seller.address);
            expect(await escrow.getStatus()).to.equal(2);
        });

        it("Should revert when called by buyer or arbiter", async function () {
            await expect(escrow.connect(buyer).confirmDelivery()).to.be.revertedWithCustomError(escrow, "NotSeller");
            await expect(escrow.connect(arbiter).confirmDelivery()).to.be.revertedWithCustomError(escrow, "NotSeller");
        });

        it("Should revert when not funded", async function () {
            await expect(escrow.connect(seller).confirmDelivery()).to.be.revertedWithCustomError(escrow, "InvalidState");
        });

        it("Should revert when confirmed more than once", async function () {
            await escrow.connect(buyer).deposit({ value: TEN_ETH });
            await escrow.connect(seller).confirmDelivery();
            await expect(escrow.connect(seller).confirmDelivery()).to.be.revertedWithCustomError(escrow, "InvalidState");
        });
    });

    describe("Release Funds", function(){
        it("Should release funds to seller", async function(){
            await escrow.connect(buyer).deposit({ value: TEN_ETH });
            await escrow.connect(seller).confirmDelivery();

            await expect (escrow.connect(buyer).releaseFunds()).to.emit(escrow, "Released").withArgs(seller.address, TEN_ETH);
            expect (await escrow.getStatus()).to.equal(4);
        });

        it("Should transfer ETH to seller", async function(){
            await escrow.connect(buyer).deposit({ value: TEN_ETH });
            await escrow.connect(seller).confirmDelivery();

            await expect(escrow.connect(buyer).releaseFunds()).to.changeEtherBalances([escrow, seller], [TEN_ETH.mul(-1), TEN_ETH]);
            expect (await ethers.provider.getBalance(escrow.address)).to.changeEtherBalance(escrow, 0);
            expect (await ethers.provider.getBalance(seller.address)).to.changeEtherBalance(seller, TEN_ETH);
        });

        it("Should revert when called by non-buyer", async function(){
            await escrow.connect(buyer).deposit({ value: TEN_ETH });
            await escrow.connect(seller).confirmDelivery();

            await expect (escrow.connect(seller).releaseFunds()).to.be.revertedWithCustomError(escrow, "NotBuyer");
            await expect (escrow.connect(arbiter).releaseFunds()).to.be.revertedWithCustomError(escrow, "NotBuyer");
        });

        it("Should revert when buyer calls before delivery confirmation", async function(){
            await escrow.connect(buyer).deposit({ value: TEN_ETH });

            await expect (escrow.connect(buyer).releaseFunds()).to.be.revertedWithCustomError(escrow, "InvalidState");
        });

        it("Should revert on multiple releases", async function(){
            await escrow.connect(buyer).deposit({ value: TEN_ETH });
            await escrow.connect(seller).confirmDelivery();
            await escrow.connect(buyer).releaseFunds();
            
            await expect (escrow.connect(buyer).releaseFunds()).to.be.revertedWithCustomError(escrow, "InvalidState");
        });
    })
})