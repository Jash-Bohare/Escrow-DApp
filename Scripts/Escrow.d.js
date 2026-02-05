async function main() {
    const [buyer, seller, arbiter] = await ethers.getSigners();

    console.log("Buyer address: ", buyer.address);
    console.log("Seller address: ", seller.address);
    console.log("Arbiter address: ", arbiter.address);

    const Escrow = await ethers.getContractFactory("Escrow");

    const escrow = await Escrow.deploy(seller.address, arbiter.address);

    console.log("Escrow deployed to: ", escrow.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
