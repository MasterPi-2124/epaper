import { ParallaxBanner, ParallaxProvider } from "react-scroll-parallax";

export default function Asd() {
    
    const string = "ghdsn38994bnio123p3445909?lat=34.231232&lon=123.545123";
    const items = Array.from({ length: 54 }, (_, index) => {
        const marginLeft = 70 + index * 14;
        const modifiedMarginLeft = `${marginLeft}px`;
        const speed = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
        const firstCharacter = string[index % string.length];
      
        return (
            {
                children: (
                    <div class="box" style={{ marginLeft: modifiedMarginLeft }}>
                      <ul>
                        <li class="item-1">{firstCharacter}</li>
                        <li class="item-2">h</li>
                        <li class="item-3">g</li>
                        <li class="item-4">v</li>
                        <li class="item-5">d</li>
                        <li class="item-6">g</li>
                        <li class="item-7">k</li>
                        <li class="item-8">k</li>
                        <li class="item-9">m</li>
                        <li class="item-10">3</li>
                        <li class="item-11">B</li>
                        <li class="item-12">7</li>
                        <li class="item-13">n</li>
                        <li class="item-14">t</li>
                        <li class="item-15">m</li>
                        <li class="item-16">x</li>
                        <li class="item-17">k</li>
                        <li class="item-18">J</li>
                        <li class="item-19">a</li>
                        <li class="item-20">z</li>
                        <li class="item-21">c</li>
                        <li class="item-22">1</li>
                        <li class="item-23">9</li>
                        <li class="item-24">5</li>
                        <li class="item-25">3</li>
                        <li class="item-26">1</li>
                        <li class="item-27">g</li>
                        <li class="item-28">n</li>
                        <li class="item-29">0</li>
                        <li class="item-30">r</li>
                        <li class="item-31">G</li>
                        <li class="item-32">d</li>
                        <li class="item-33">I</li>
                        <li class="item-34">d</li>
                        <li class="item-35">L</li>
                        <li class="item-36">2</li>
                      </ul>
                    </div>
                ),
                speed: speed,
                shouldAlwaysCompleteAnimation: true,
            }
        );
      });
      

    return (
        <div className='asd-container'>
            <ParallaxBanner
                layers={
                    items
                }
                style={{
                    width: "100%",
                    height: "100%",
                    // marginTop: "400px",
                    position: "relative"
                }}
            >
                quiz/
            </ParallaxBanner>
        </div>
    )
}