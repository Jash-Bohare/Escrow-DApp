async function main() {
  const [deployer] = await ethers.getSigners();

  const SELLER_ADDRESS = "0x6437df87F8b6f313e12e45FC88b69C8247224908";
  const ARBITER_ADDRESS = "0xb78407D102b2C36623307CAa9A2C7A7118330d37";

  console.log("Deployer (Buyer): ", deployer.address);
  console.log("Seller: ", SELLER_ADDRESS);
  console.log("Arbiter: ", ARBITER_ADDRESS);

  const Escrow = await ethers.getContractFactory("Escrow");

  const escrow = await Escrow.deploy(SELLER_ADDRESS, ARBITER_ADDRESS);

  console.log("Escrow deployed to: ", escrow.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
