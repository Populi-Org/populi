"use client";

import { useState } from "react";

const colorToParty: Record<string, string> = {
  "#990000": "Bloco de Esquerda",
  "#cc0000": "Partido Comunista Português",
  "#ff66cc": "Partido Socialista",
  "#00aa00": "Livre",
  "#00cc66": "Pessoas-Animais-Natureza",
  "#3ae0ac": "Juntos Pelo Povo",
  "#ff9900": "Partido Social Democrata",
  "#0047ab": "Centro Democrático Social",
  "#00aaff": "Iniciativa Liberal",
  "#202056": "Chega",
};

export default function CompositionSvg() {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    text: string;
    x: number;
    y: number;
  }>({ visible: false, text: "", x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!tooltip.visible) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip((prev) => ({
      ...prev,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 12,
    }));
  };

  const handleMouseOver = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    if (target.tagName.toLowerCase() === "circle") {
      const fill = target.getAttribute("fill");
      if (fill && colorToParty[fill]) {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
          visible: true,
          text: colorToParty[fill],
          x: e.clientX - rect.left,
          y: e.clientY - rect.top - 12,
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="relative inline-block">
      <svg
        onMouseMove={handleMouseMove}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      viewBox="0 0 300 140"
      className="w-full h-40"
      style={{ width: "500px", maxWidth: "500px" }}
      role="img"
      aria-labelledby="composition-title"
    >
      <title id="composition-title">Composição do Parlamento</title>
      <circle
        cx="115"
        cy="120"
        r="2"
        fill="#990000"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="105"
        cy="120"
        r="2"
        fill="#cc0000"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="95"
        cy="120"
        r="2"
        fill="#cc0000"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="85"
        cy="119.99999999999999"
        r="2"
        fill="#cc0000"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="75"
        cy="119.99999999999999"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="65"
        cy="119.99999999999999"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="55"
        cy="119.99999999999999"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="45"
        cy="119.99999999999999"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="55.34223858845998"
        cy="111.9434371748266"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="65.34218501040468"
        cy="112.38065874320814"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="45.42269913049989"
        cy="110.58787256513946"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="75.38480074560786"
        cy="112.41237585094258"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="85.4395067467737"
        cy="112.45396058186003"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="95.51227296800181"
        cy="112.51083429970643"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="105.6137413468775"
        cy="112.59324343736697"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="56.36648851696769"
        cy="103.94492206942434"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="66.36598496911648"
        cy="104.82266394211588"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="46.68739319714389"
        cy="101.25152604614314"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="76.53525440606292"
        cy="104.90261099335049"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="115.7648339743168"
        cy="112.72309082137842"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="86.75208341231145"
        cy="105.00996840174138"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="58.06537004131762"
        cy="96.0620841684131"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="68.06315684085247"
        cy="97.38686812683261"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="48.78389962693541"
        cy="92.0661312154991"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="97.03954919587105"
        cy="105.16117758636366"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="78.43955576999633"
        cy="97.54776577699815"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="107.43822412347144"
        cy="105.38852388578924"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="60.426642681196995"
        cy="88.35171949950453"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="88.91997964891596"
        cy="97.76869068383152"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="70.42003599562234"
        cy="90.13313995308586"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="51.69533858282759"
        cy="83.105643471459"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="81.07816412848271"
        cy="90.42331086650111"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="99.55337841720008"
        cy="98.08794005845672"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="118.02590898250898"
        cy="105.76421749234699"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="63.43329341312712"
        cy="80.86938141682069"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="73.41764622829439"
        cy="83.11988217500755"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="55.398268870246"
        cy="74.44220739265639"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="91.91387837897821"
        cy="90.82805328696995"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="110.423681195708"
        cy="98.58236731333169"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="84.42400378915634"
        cy="83.60235281016892"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="67.06365924968715"
        cy="73.66898033770468"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="77.03185254384138"
        cy="76.40356142049797"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="59.86287667180406"
        cy="66.14557587237985"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="103.00693274994313"
        cy="91.42288274805117"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="95.69329225815915"
        cy="84.2819164253976"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="71.291583321835"
        cy="66.80239531692843"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="88.44274190945427"
        cy="77.15488386789058"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="121.68440519687684"
        cy="99.42751616976344"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="81.23355547812947"
        cy="70.03825355513978"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="65.05321559063053"
        cy="58.28254850929031"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="114.4886770771623"
        cy="92.36042792896494"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="76.08660333974824"
        cy="60.319100256914"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="107.3358790112569"
        cy="85.29016306206708"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="100.20711119726644"
        cy="78.21880537037494"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="93.09314079804068"
        cy="71.14706379583333"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="85.98892538969308"
        cy="64.07520829512441"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="70.92749606962086"
        cy="50.916433776330166"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="81.41417107432018"
        cy="54.26580744713311"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="91.2596748361165"
        cy="58.562436574671715"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="77.43842185637921"
        cy="44.10653929812389"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="98.32748106932351"
        cy="65.640540957816"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="105.39429353853232"
        cy="72.72071329775183"
        r="2"
        fill="#ff66cc"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="112.45957712297403"
        cy="79.80402196470317"
        r="2"
        fill="#00aa00"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="119.52232927684166"
        cy="86.89242401970907"
        r="2"
        fill="#00aa00"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="126.58042877743996"
        cy="93.9899311082912"
        r="2"
        fill="#00aa00"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="87.23590127794228"
        cy="48.68613100099117"
        r="2"
        fill="#00aa00"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="97.00336684200765"
        cy="53.544323990217464"
        r="2"
        fill="#00aa00"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="84.53357080483299"
        cy="37.907694340856864"
        r="2"
        fill="#00aa00"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="104.09205130892528"
        cy="60.69181972967261"
        r="2"
        fill="#00cc66"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="111.18469153931892"
        cy="67.86199247092213"
        r="2"
        fill="#3ae0ac"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="93.50984825109278"
        cy="43.62027261514065"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="118.2825822836823"
        cy="75.06665588442569"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="103.1737565765713"
        cy="49.06127343368928"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="92.15581694752925"
        cy="32.36980835926322"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="125.3873328844908"
        cy="82.32750847818622"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="110.32769922547782"
        cy="56.35168068789368"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="100.19080806206301"
        cy="39.10473191533542"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="132.5"
        cy="89.68911086754466"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="117.49999999999999"
        cy="63.708348754011496"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="109.72116368979512"
        cy="45.14937979217727"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="100.24379044033515"
        cy="27.537469155042515"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="124.69642292478663"
        cy="71.16631298786936"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="107.23064424232103"
        cy="35.172043475791"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="116.97043863317742"
        cy="52.66465953219438"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="131.92370589061636"
        cy="78.79020030052241"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="124.25481520745481"
        cy="60.31595305278219"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="116.59287230941649"
        cy="41.840139333126686"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="108.73237167633803"
        cy="23.449583882097684"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="114.5786346108707"
        cy="31.850542406831607"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="123.95210603663848"
        cy="49.668590088968955"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="131.58162133059577"
        cy="68.17564928346488"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="139.18440519687684"
        cy="86.71302192966962"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="123.73355547812947"
        cy="39.16019611491194"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="117.55321559063053"
        cy="20.139065789008868"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="122.18183672872772"
        cy="29.16416019977116"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="131.35778987377913"
        cy="57.730681699493225"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="131.20106008059597"
        cy="47.394216085034685"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="138.95315307866403"
        cy="76.37698803273014"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="131.08572061371328"
        cy="37.13112746454499"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="126.63530193458699"
        cy="17.632569220908522"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="129.985469350406"
        cy="27.132252299969807"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="138.80991928210514"
        cy="66.15037517747224"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="138.71286845164954"
        cy="55.987496054206474"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="138.64291668715674"
        cy="45.864875675391644"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="138.5901724054993"
        cy="35.76927024972554"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="135.90550708914617"
        cy="15.950275014366838"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="137.93330712404654"
        cy="25.76945865040669"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="146.34150378563214"
        cy="85.19173366211044"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="146.28392945374506"
        cy="75.15369781469985"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="146.24666726494308"
        cy="65.12821769452034"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="146.2205861208191"
        cy="55.10996971236757"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="146.20131233709654"
        cy="45.09626196217104"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="146.18648942020624"
        cy="35.08558934398825"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="145.28919281319594"
        cy="15.10572801316195"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="145.9680856963659"
        cy="25.08559821055526"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="154.0319143036341"
        cy="25.08559821055526"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="153.81351057979379"
        cy="35.08558934398826"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="154.71080718680406"
        cy="15.105728013161965"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="153.79868766290346"
        cy="45.09626196217104"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="153.77941387918094"
        cy="55.10996971236757"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="153.75333273505692"
        cy="65.12821769452034"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="153.71607054625497"
        cy="75.15369781469985"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="153.65849621436786"
        cy="85.19173366211044"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="162.0666928759535"
        cy="25.769458650406705"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="161.4098275945007"
        cy="35.76927024972555"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="164.09449291085383"
        cy="15.950275014366852"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="161.35708331284326"
        cy="45.864875675391644"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="161.28713154835046"
        cy="55.987496054206474"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="161.19008071789486"
        cy="66.15037517747226"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="170.014530649594"
        cy="27.13225229996982"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="168.91427938628672"
        cy="37.13112746454499"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="173.36469806541302"
        cy="17.632569220908522"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="161.04684692133594"
        cy="76.37698803273013"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="168.79893991940403"
        cy="47.394216085034685"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="168.64221012622087"
        cy="57.730681699493225"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="177.81816327127228"
        cy="29.16416019977116"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="160.81559480312316"
        cy="86.71302192966962"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="176.26644452187054"
        cy="39.160196114911955"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="182.44678440936949"
        cy="20.139065789008882"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="168.41837866940423"
        cy="68.17564928346488"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="176.04789396336153"
        cy="49.66859008896897"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="185.42136538912933"
        cy="31.850542406831607"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="183.40712769058348"
        cy="41.840139333126686"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="191.26762832366197"
        cy="23.449583882097684"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="175.7451847925452"
        cy="60.31595305278219"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="168.07629410938364"
        cy="78.79020030052241"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="183.02956136682258"
        cy="52.66465953219438"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="192.76935575767897"
        cy="35.172043475791"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="175.30357707521338"
        cy="71.16631298786936"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="190.2788363102049"
        cy="45.14937979217727"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="199.75620955966485"
        cy="27.537469155042515"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="167.5"
        cy="89.68911086754464"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="182.5"
        cy="63.70834875401148"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="199.80919193793702"
        cy="39.10473191533542"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="189.6723007745222"
        cy="56.35168068789369"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="174.61266711550923"
        cy="82.32750847818622"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="196.8262434234287"
        cy="49.06127343368928"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="207.84418305247078"
        cy="32.36980835926322"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="181.7174177163177"
        cy="75.0666558844257"
        r="2"
        fill="#ff9900"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="206.49015174890724"
        cy="43.620272615140664"
        r="2"
        fill="#0047ab"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="188.81530846068108"
        cy="67.86199247092215"
        r="2"
        fill="#0047ab"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="195.9079486910747"
        cy="60.691819729672595"
        r="2"
        fill="#00aaff"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="202.99663315799236"
        cy="53.544323990217464"
        r="2"
        fill="#00aaff"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="215.46642919516702"
        cy="37.907694340856864"
        r="2"
        fill="#00aaff"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="212.76409872205772"
        cy="48.68613100099118"
        r="2"
        fill="#00aaff"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="173.41957122256002"
        cy="93.98993110829119"
        r="2"
        fill="#00aaff"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="180.47767072315835"
        cy="86.89242401970907"
        r="2"
        fill="#00aaff"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="187.540422877026"
        cy="79.8040219647032"
        r="2"
        fill="#00aaff"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="194.60570646146766"
        cy="72.72071329775184"
        r="2"
        fill="#00aaff"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="201.67251893067646"
        cy="65.64054095781599"
        r="2"
        fill="#00aaff"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="208.74032516388348"
        cy="58.562436574671715"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="222.5615781436208"
        cy="44.10653929812389"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="218.58582892567983"
        cy="54.26580744713311"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="214.01107461030693"
        cy="64.07520829512444"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="229.07250393037916"
        cy="50.91643377633018"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="206.90685920195932"
        cy="71.14706379583333"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="199.7928888027336"
        cy="78.21880537037497"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="192.6641209887431"
        cy="85.2901630620671"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="223.91339666025175"
        cy="60.319100256914"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="185.5113229228377"
        cy="92.36042792896495"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="178.31559480312316"
        cy="99.42751616976344"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="218.76644452187054"
        cy="70.03825355513979"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="234.94678440936949"
        cy="58.28254850929032"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="211.55725809054573"
        cy="77.15488386789059"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="228.708416678165"
        cy="66.80239531692845"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="204.30670774184085"
        cy="84.28191642539761"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="196.99306725005687"
        cy="91.42288274805114"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="222.96814745615862"
        cy="76.40356142049798"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="240.13712332819594"
        cy="66.14557587237985"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="232.93634075031287"
        cy="73.6689803377047"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="215.57599621084367"
        cy="83.60235281016892"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="189.57631880429201"
        cy="98.58236731333169"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="208.0861216210218"
        cy="90.82805328696995"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="226.58235377170564"
        cy="83.11988217500756"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="244.601731129754"
        cy="74.4422073926564"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="236.5667065868729"
        cy="80.86938141682069"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="181.97409101749105"
        cy="105.764217492347"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="200.44662158279993"
        cy="98.08794005845672"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="218.92183587151732"
        cy="90.42331086650111"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="229.57996400437764"
        cy="90.13313995308587"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="248.3046614171724"
        cy="83.10564347145902"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="211.08002035108404"
        cy="97.76869068383152"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="239.573357318803"
        cy="88.35171949950454"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="192.56177587652857"
        cy="105.38852388578925"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="221.56044423000367"
        cy="97.54776577699816"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="202.96045080412898"
        cy="105.16117758636366"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="231.93684315914754"
        cy="97.38686812683261"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="251.2161003730646"
        cy="92.06613121549911"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="241.9346299586824"
        cy="96.06208416841314"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="213.24791658768856"
        cy="105.00996840174139"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="184.2351660256832"
        cy="112.72309082137843"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="223.4647455939371"
        cy="104.90261099335049"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="233.63401503088352"
        cy="104.82266394211588"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="253.31260680285612"
        cy="101.25152604614316"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="243.6335114830323"
        cy="103.94492206942434"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="194.3862586531225"
        cy="112.59324343736698"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="204.4877270319982"
        cy="112.51083429970642"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="214.5604932532263"
        cy="112.45396058186006"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="224.61519925439214"
        cy="112.41237585094255"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="234.65781498959532"
        cy="112.38065874320816"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="254.5773008695001"
        cy="110.58787256513948"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="244.65776141154004"
        cy="111.94343717482661"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="185"
        cy="119.99999999999999"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="195"
        cy="120"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="205"
        cy="120"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="215"
        cy="120"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="225"
        cy="120"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="235"
        cy="120"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="245"
        cy="120"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <circle
        cx="255"
        cy="120"
        r="2"
        fill="#202056"
        className="hover:stroke-black hover:stroke-1 transition-all duration-200 cursor-pointer"
        opacity="0.9"
      />
      <rect
        x="140"
        y="115"
        width="20"
        height="8"
        rx="2"
        fill="currentColor"
        className="opacity-60 text-muted-foreground"
      />
      </svg>
      {tooltip.visible && (
        <div
          className="absolute pointer-events-none z-50 bg-surface-container border-2 border-stone-900 text-on-surface font-label text-xs px-2 py-1 solid-shadow whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
