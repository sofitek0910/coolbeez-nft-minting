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
				<button className="connect-button btn ml-2 d-inline-block no-display"><i className="fa-solid fa-network-wired"></i> CONNECT</button>
			</div>
		</nav>

		<section className="hero-section wow zoomIn">
			<img className="width-100" src="./assets/images/websitebannerblack.png"/>
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
								Coolbeez is a unique Community Utility NFT featuring hand drawn characters and traits, and the first in a series of community collections from the My Meta Foundation
								Proceeds from the sales of the collection are donated to the Community Development Fund.  The CDF will then purchase virtual real estate in whichever virtual world the community decides upon. 
							</span>
						</div>
						<div className="text-center wow zoomInUp">
							<button 
								className="mint_button btn mt-5 no-display"
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
				All metaverse real estate, utilities and subsequent revenues generated in the metaverse by the community real estate portfolio will be 100% owned by our NFT holders and held in the CDF. 
				All holders become virtual-landlords in the new virtual world with an equal share in the real estate portfolio based on the number of NFTs that you hold!
				The Community Development Fund will also be used to develop anything from game rooms, events halls and stores to VR meeting and private family rooms. 
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
		<div className="coolbeez-content text-center font_general line-height-18 pt-30 wow bounceIn pt-30">
			Whilst the My Meta Foundation have an ambitious plan outlined to grow the community as quickly as possible, the whole purpose of this community is for you to decide the roadmap once the foundations have been laid. 
			There will be votes along the way for all NFT holders, but here is what we have so far:
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
									<span className="top_title">March (dates TBC)</span>
								</div>
								<div className="font_general line-height-18">
									CoolBeez Smart Contract deployed. <br/>
									CoolBeez Whitelist Presale. <br/>
									CoolBeez Public Sale.
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
									<span className="top_title">April</span>
								</div>
								<div className="font_general line-height-18">
									Community voting round 1/22 – Metaverse land location vote.<br/>
									Community Meteverse land purchase from CoolBeez launch.<br/>
									Community voting round 2/22 – Metaverse land usage vote.
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
									<span className="top_title">May</span>
								</div>
								<div className="font_general line-height-18">
									Whitelisting and Discord opening for ‘Anti-Social Elephant Club ’ collection.<br/>
									Community voting round 3/22 – Community Development Fund usage for 2022 vote. 
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
									<span className="top_title">June</span>
								</div>
								<div className="font_general line-height-18">
									Anti-Social Elephant Club Smart Contract deployed.<br/>
									Anti-Social Elephant Club Whitelist Presale.<br/>
									Anti-Social Elephant Club Airdrop to existing CoolBeez holders.<br/>
									Anti-Social Elephant Club Public Sale.<br/>
									Develop new community voting platform.<br/>
									Develop Metaverse land usage decided in voting round 3.
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
									<span className="top_title">July</span>
								</div>
								<div className="font_general line-height-18">
									Whitelist and Discord opening for ‘Pretty But Deadly’ collection.<br/>
									Community voting round 4/22 – second Metaverse land location vote.<br/>
									Community Meteverse land purchase from Anti-Social Elephant Club launch.<br/>
									Community voting round 5/22 – Metaverse land usage vote.<br/>
									Pretty But Deadly Airdrop to existing community NFT holders.<br/>
									Community Meteverse Anti-Social Elephant Club land development.
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
									<span className="top_title">August</span>
								</div>
								<div className="font_general line-height-18">
									Pretty But Deadly Smart Contract deployed.<br/>
									Pretty But Deadly Whitelist Presale.<br/>
									Pretty But Deadly Airdrop to existing community NFT holders.<br/>
									Pretty But Deadly Public Sale.
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
									<span className="top_title">September</span>
								</div>
								<div className="font_general line-height-18">
									Ready 4th NFT collection launch as voted on by the community. 
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
									<span className="top_title">The Future</span>
								</div>
								<div className="font_general line-height-18">
									The future is your hands!
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
							Do you want to be on the whitelist? 
							Get all the latest information on the CoolBeez Discord server. Come on in!
						</div>
						<a href="https://discord.gg/fmWdR5xHPegit">
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
				<div className="col-lg-1 col-md-0"></div>
				<div className="col-lg-2 col-md-6 col-sm-12 text-center wow zoomInUp" data-wow-offset="150">
					<img className="team-image" src="./assets/images/Mascots V3 1.png"/>
					<div className="team-caption">
						Dan Maguire 
					</div>
				</div>
				<div className="col-lg-2 col-md-6 col-sm-12 text-center wow zoomInUp" data-wow-offset="150">
					<img className="team-image" src="./assets/images/Mascots V3 2.png"/>
					<div className="team-caption">
						Bart Vonk 
					</div>
				</div>
				<div className="col-lg-0 col-md-3 col-sm-0 bingo-col"></div>
				<div className="col-lg-2 col-md-6 col-sm-12 text-center wow zoomInUp" data-wow-offset="150">
					<img className="team-image" src="./assets/images/Mascots V3 3.png"/>
					<div className="team-caption">
						Ella Maguire 
					</div>
				</div>
				<div className="col-lg-0 col-md-3 col-sm-0 bingo-col"></div>
				<div className="col-lg-2 col-md-6 col-sm-12 text-center wow zoomInUp" data-wow-offset="150">
					<img className="team-image" src="./assets/images/Mascots V3 4.png"/>
					<div className="team-caption">
						Malin Zhang
					</div>
				</div>
				<div className="col-lg-2 col-md-6 col-sm-12 text-center wow zoomInUp" data-wow-offset="150">
					<img className="team-image" src="./assets/images/Mascots V3 5.png"/>
					<div className="team-caption">
						Anon
					</div>
				</div>
				<div className="col-lg-1 col-md-0"></div>
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
						<p>CoolBeez is a Community NFT collection with unique holder benefits and is part of the My Meta Foundation. </p>
					</div>
				</div>
				<div className="mt-4 accordion-container footer_round wow slideInRight">
					<button className="accordion py-2">
						<h1 className="footer-font">When will the CoolBeez NFT collection be launched and minted?</h1>
					</button>
					<div className="panel">
						<p>The CoolBeez NFT collection is expected to be launched and minted by the end of March 2022. </p>
					</div>
				</div>
				<div className="mt-4 accordion-container footer_round wow slideInRight">
					<button className="accordion py-2">
						<h1 className="footer-font">What is the expected floor price for CoolBeez? </h1>
					</button>
					<div className="panel">
						<p>The expected floor price of the CoolBeez NFT collection will be announced on our Discord server shortly. </p>
					</div>
				</div>
				<div className="mt-4 accordion-container footer_round wow slideInRight">
					<button className="accordion py-2">
						<h1 className="footer-font">Where can I buy a CoolBeez NFT? </h1>
					</button>
					<div className="panel">
						<p>You can get hold of a CoolBeez NFT by visiting OpenSea or directly from this page by linking your wallet. CoolBeez NFT collection on OpenSea: https://opensea.io/collection/coolbeez </p>
					</div>
				</div>
				<div className="mt-4 accordion-container footer_round wow slideInRight">
					<button className="accordion py-2">
						<h1 className="footer-font">When will the Whitelist be available? </h1>
					</button>
					<div className="panel">
						<p>The Whitelist for the CoolBeez NFT collection will be opened by mid-February 2022, but due to the increasing demand that we have already, we may bring this forward. 
							Places are limited but the first 100 members to join our discord will be guaranteed a place. 
							Places will also be available through giveaways and competitions hosted on Discord.</p>
					</div>
				</div>
				<div className="mt-4 accordion-container footer_round wow slideInRight">
					<button className="accordion py-2">
						<h1 className="footer-font">What utility does the CoolBeez NFT have?  </h1>
					</button>
					<div className="panel">
						<p>CoolBeez NFT owners will own a share in the Community Development Fund and in the virtual metaverse real estate portfolio. Each NFT you hold allows you one vote to decide how the CDF is used to develop the metaverse land that the community owns. </p>
					</div>
				</div>
				<div className="mt-4 accordion-container footer_round wow slideInRight">
					<button className="accordion py-2">
						<h1 className="footer-font">How will you grow the community after the CoolBeez collection is sold out? </h1>
					</button>
					<div className="panel">
						<p>The CoolBeez collection is part of the My Meta Foundation. The foundations road map is to release 6 NFT collections throughout 2022 and 2023. The next in the series is ‘Anti-Social Elephant Club’ with work on the project already underway. Holders of all future NFT collections will join the community and proceeds from the sales of the collections will be donated to the same Community Development Fund. As the community grows, so does the fund and the portfolio.</p>
					</div>
				</div>
				<div className="mt-4 accordion-container footer_round wow slideInRight">
					<button className="accordion py-2">
						<h1 className="footer-font">Why does the project support good causes and how will that affect the Community Development Fund?</h1>
					</button>
					<div className="panel">
						<p>We believe that the Future of Giving lays in the power of Web 3.0 and we want to create a bridge between our two worlds. The creators will donate a percentage of the foundation’s profits to good causes. The Community Development Fund will NOT be used for charitable donations unless the community decide to do so. </p>
					</div>
				</div>
			</div>
		</section>
    </div>
  );
}

export default App;
