import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import swal  from 'sweetalert';
import styled from "styled-components";

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [walletAddress, setWallet] = useState("");
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    FINNEY_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    console.log("smartcontract--->", blockchain.smartContract)
    // setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    swal(`Minting your ${CONFIG.NFT_NAME}...`, "", "info");
    setClaimingNft(true);
    blockchain.smartContract.methods
      .publicSaleMint()
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        swal('Sorry, something went wrong please try again later.',"", "error");
        // setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        swal(`WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`,"", "success");
        // setFeedback(
        //   `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        // );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 20) {
      newMintAmount = 20;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
    console.log("account===>", blockchain.account)
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <div>
		<nav className="navbar container-fluid p-4 wow fadeInDown">
			<a href="#">
				<div className="navbar_logo float-left">CoolBeez</div>
			</a>
			<div className="float-right navbar_right">
				{/* <div className="d-inline-block">
					<a href="">
						<img src="./assets/images/discord_black_icon.png" className="social_footer_image"/>
					</a>
					<a href="">
						<img src="./assets/images/twitter_black_icon.png" className="social_footer_image"/>
					</a>
				</div> */}
				<button className="connect-button btn ml-2 d-inline-block"><i class="fa-solid fa-network-wired"></i> CONNECT</button>
			</div>
		</nav>

		<section className="hero-section wow zoomIn">
			<img className="width-100" src="./assets/images/BEES_BACKGROUND.jpg"/>
		</section>

		<section className="about-section">
			<div className="col-12 text-center d-flex justify-content-center wow fadeInUp">
				<span className="section_title line-height-15">WELCOME TO THe COOLBEEZ</span>
			</div>
			<div className="row mx-0 px-0 pt-30">
				<div className="col-md-5 mt-md-0 px-5 mr-0 wow rollIn">
					<div>
						<img className="img-thumbnail" src="./assets/images/character.gif" className="w-100"/>
					</div>
				</div>
				<div className="col-md-7 d-flex px-5 align-items-center text-center welcome-text-block">
					<div className="pl-md-3">
						<div className="pt-md-3  wow fadeInUp">
							<span className="font_general line-height-18">
								The Cool Beez NFT, also called "CoolBeez" within the community, is the first NFT collection of the Cool Beez 
								Studios brand. CoolBeez provides owners exclusive 
								"presale mint" opportunities and early access to every new release from the Cool Beez Studios, 
								including upcoming P2E games, gaming events, and much more.
							</span>
						</div>
						<div className="text-center wow zoomInUp">
							<button 
								className="mint_button btn mt-5"
								disabled={claimingNft ? 1 : 0}
								onClick={(e) => {
									e.preventDefault();
									claimNFTs();
									getData();
								}}
								>
								{claimingNft ? "MINTING..." : "MINT"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section className="slide-container">
			<div className="col-12 text-center d-flex justify-content-center wow fadeInUp">
				<div className="section_title line-height-15">CoolBeez NFT</div>
			</div>
			<div className="coolbeez-content text-center font_general line-height-18 pt-30 wow bounceIn">
				The CoolBeez is a collection of 6,000 generative bees inspired by CoolBeez team.<br/>
				Each artwork is original, with its own color traits and accessories. The objective was to make each bee unique in order to prioritize quality above quantity.
			</div>
			<div className="swiper mySwiper wow fadeIn">
				<div className="swiper-wrapper">
					<div className="swiper-slide">
						<img className="slide_image img-thumbnail" src="./assets/images/Mascots V3 1.jpg" alt=""/>
					</div>
					<div className="swiper-slide">
						<img className="slide_image img-thumbnail" src="./assets/images/Mascots V3 2.jpg" alt=""/>
					</div>
					<div className="swiper-slide">
						<img className="slide_image img-thumbnail" src="./assets/images/Mascots V3 3.jpg" alt=""/>
					</div>
					<div className="swiper-slide">
						<img className="slide_image img-thumbnail" src="./assets/images/Mascots V3 4.jpg" alt=""/>
					</div>
					<div className="swiper-slide">
						<img className="slide_image img-thumbnail" src="./assets/images/Mascots V3 5.jpg" alt=""/>
					</div>
					<div className="swiper-slide">
						<img className="slide_image img-thumbnail" src="./assets/images/Mascots V3 6.jpg" alt=""/>
					</div>
					<div className="swiper-slide">
						<img className="slide_image img-thumbnail" src="./assets/images/Mascots V3 7.jpg" alt=""/>
					</div>
				</div>
				<div className="swiper-pagination"></div>
			</div>
		</section>

		<div className="col-12 text-center d-flex justify-content-center pt-30">
			<span className="section_title gtfcduyjdc wow fadeInUp">THE ROADMAP</span>
		</div>
		<section className="roadmap pb-5">
			<div className="roadmap_title_back"></div>
			<div className="top_one container-fluid mt-5 roadmap-padding">
				<div className="row pb-5 mx-0 position-relative mx-0 wow fadeInUp">
					<div className="col-md-12">
						<div className="row rounded roadmap_round py-4">
							<div className="col-md-1 col-2 d-inline dot_data p-0">
								<span className="dot"></span>
							</div>
							<div className="col-md-11 col-10 d-inline mt-4">
								<div className="">
									<span className="top_title_num roadmap_font"> </span>
									<span className="top_title">Saving The World</span>
								</div>
								<div className="font_general line-height-18">
									With the purchase of Honey Bee NFTs you are directly supporting the activities of 2 non profit organizations 
									that work towards preserving the bees of planet Earth. Holders of Honey Bee NFTs will have the opportunity 
									to actively participate in one of the non profits' activities.
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row pb-5 mx-0 position-relative mx-0 wow fadeInUp">
					<div className="col-md-12">
						<div className="row rounded roadmap_round py-4">
							<div className="col-md-1 col-2 d-inline dot_data p-0">
								<span className="dot"></span>
							</div>
							<div className="col-md-11 col-10 d-inline mt-4">
								<div className="">
									<span className="top_title_num roadmap_font"></span>
									<span className="top_title">Marketing Campaigns</span>
								</div>
								<div className="font_general line-height-18">
									The Honey Bee Club founders team has dedicated over $225.000 into marketing campaigns for our pre-launch and launch phases. 
									With worldwide partners, the team's vision is to build a long-term project that will bring awareness towards the importance of bees 
									as well as making sure the floor value of the NFTs rises in correlation with the project development.
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row pb-5 mx-0 position-relative mx-0 wow fadeInUp">
					<div className="col-md-12">
						<div className="row rounded roadmap_round py-3">
							<div className="col-md-1 col-2 d-inline dot_data p-0">
								<span className="dot"></span>
							</div>
							<div className="col-md-11 col-10 d-inline mt-4">
								<div className="">
									<span className="top_title_num roadmap_font"> </span>
									<span className="top_title">Hiveminded</span>
								</div>
								<div className="font_general line-height-18">
									Once all the Honey Bees are under your safety we will deploy burnable tokens to the holders of at least 3 Honey Bees. 
									Once our second NFT collection goes live, every holder of 3 Honey Bees will be able to burn that token 
									in exchange of getting 1 Queen Bee airdropped to their wallet for free.
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row pb-5 mx-0 position-relative mx-0 wow fadeInUp">
					<div className="col-md-12">
						<div className="row rounded roadmap_round py-4">
							<div className="col-md-1 col-2 d-inline dot_data p-0">
								<span className="dot"></span>
							</div>
							<div className="col-md-11 col-10 d-inline mt-4">
								<div className="">
									<span className="top_title_num roadmap_font"> </span>
									<span className="top_title">Giving Back</span>
								</div>
								<div className="font_general line-height-18">
									25% of all sales from minting Honey Bee NFTs and Queen Bee NFTs will be donated towards our nonprofit partners on their mission towards the preservation of bees. 
									This is one of the core values of this project, by donating to these non profit organizations we are together directly assisting the preservation of bees on planet Earth.
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row pb-5 mx-0 position-relative mx-0 wow fadeInUp">
					<div className="col-md-12">
						<div className="row rounded roadmap_round py-4">
							<div className="col-md-1 col-2 d-inline dot_data p-0">
								<span className="dot"></span>
							</div>
							<div className="col-md-11 col-10 d-inline mt-4">
								<div className="">
									<span className="top_title_num roadmap_font"> </span>
									<span className="top_title">Play To Earn Gaming</span>
								</div>
								<div className="font_general line-height-18">
									The game will offer holders of Honey Bee and Queen Bee NFTs the opportunity to earn crypto assets by playing the game. 
									The Honey Bee Club will start developing their own Play To Earn game after the Honey Bee Club collection is sold out.
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section className="join-discord">
			<div className="row mx-0">
				<div className="col-md-5 col-sm-12 text-center wow slideInLeft">
					<img className="discord-bee" src="./assets/images/discord_bee.png"/>
				</div>
				<div className="col-md-7 col-sm-12 text-block d-flex align-items-center text-center wow slideInRight">
					<div className="pl-md-3">
						<div className="join-discord-title rubik-font">
							JOIN OUR DISCORD
						</div>
						<div className="join-discord-content">
							Get the latest information about the Honey Bee Club and learn how you can get a spot on the Whitelist
						</div>
						<a href="">
							<button className="join-button"><i className="fab fa-discord"></i> JOIN DISCORD</button>
						</a>
					</div>
				</div>
			</div>
		</section>

		<section className="team-section">
			<div className="col-12 text-center d-flex justify-content-center wow fadeInUp">
				<div className="section_title line-height-15">MEET OUR TEAM</div>
			</div>
			<div className="row mx-0">
				<div className="col-md-4 col-sm-12 text-center wow zoomInUp" data-wow-offset="150">
					<img className="team-image" src="./assets/images/Mascots V3 1.png"/>
					<div className="team-caption">
						Founder Bee
					</div>
				</div>
				<div className="col-md-4 col-sm-12 text-center wow zoomInUp" data-wow-offset="150">
					<img className="team-image" src="./assets/images/Mascots V3 2.png"/>
					<div className="team-caption">
						Dev Bee
					</div>
				</div>
				<div className="col-md-4 col-sm-12 text-center wow zoomInUp" data-wow-offset="150">
					<img className="team-image" src="./assets/images/Mascots V3 3.png"/>
					<div className="team-caption">
						Artist Bee
					</div>
				</div>
			</div>
		</section>

		<section className="section-qa">
			<div className="col-12 text-center d-flex justify-content-center">
				<span className="section_title gtfcduyjdc wow fadeInUp">FAQS</span>
			</div>
			<div className="content container-fluid mt-md-5 mt-4 footer-padding">
				<div className="mt-4 accordion-container footer_round wow slideInRight">
					<button className="accordion py-2">
						<h1 className="footer-font">What is CoolBeez?</h1>
					</button>
					<div className="panel">
						<p>CoolBeez is a community driven NFT project made up of 6,000 AI generated NFTs with six trait layers and 100 unique traits on the Ethereum blockchain.</p>
					</div>
				</div>
				<div className="mt-4 accordion-container footer_round wow slideInRight">
					<button className="accordion py-2">
						<h1 className="footer-font">How much is the mint?</h1>
					</button>
					<div className="panel">
						<p>The pre sale price for CoolBeezs is going to be 0.1 Ethereum and if you miss out on the whitelist the remaining dragons will be sold for 0.15 Ethereum. </p>
					</div>
				</div>
				<div className="mt-4 accordion-container footer_round wow slideInRight">
					<button className="accordion py-2">
						<h1 className="footer-font">When is the launch?</h1>
					</button>
					<div className="panel">
						<p>Launch date currently is TBA and will be announced in our discord.</p>
					</div>
				</div>
				<div className="mt-4 accordion-container footer_round wow slideInRight">
					<button className="accordion py-2">
						<h1 className="footer-font">Is there a whitelist?</h1>
					</button>
					<div className="panel">
						<p>Yes, we are going to make whitelist. You can find more information about our white list in our discord.</p>
					</div>
				</div>
				<div className="mt-4 accordion-container footer_round wow slideInRight">
					<button className="accordion py-2">
						<h1 className="footer-font">Can you add more FAQ?</h1>
					</button>
					<div className="panel">
						<p>Sure, in case of any unanswered question you can alway us on discord.</p>
					</div>
				</div>
			</div>
		</section>
    </div>
  );
}

export default App;
