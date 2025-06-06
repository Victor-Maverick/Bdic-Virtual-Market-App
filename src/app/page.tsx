import HeroSection from "@/app/pages/home/heroSection";
import StatSection from "@/app/pages/home/statSection";
import OfferSection from "@/app/pages/home/offerSection";
import MarketPlaceSection from "@/app/pages/home/marketPlaceSection";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  return (
      <div className="flex flex-col">
          <Header/>
          <HeroSection/>
          <StatSection/>
          <OfferSection/>
          <MarketPlaceSection/>
          <Footer/>

      </div>
  );
}
