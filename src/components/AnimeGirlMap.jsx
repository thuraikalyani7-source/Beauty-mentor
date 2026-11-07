import animeGirl from "../assets/anime-girl-transparent.png";

const clickableRegions = [
  { name: "Hair", d: "M433 286 C390 330 340 435 300 483 C289 522 314 561 343 566 C373 555 393 477 420 423 L448 318 Z M545 280 C578 330 602 410 622 473 C637 511 621 545 593 551 C572 520 555 464 536 415 Z M424 142 C408 94 440 27 493 13 C541 2 592 29 613 76 C636 132 621 221 587 274 L563 246 L579 153 L540 100 L492 125 L450 184 Z" },
  { name: "Face", d: "M429 96 C440 66 470 53 503 61 C542 66 570 93 576 126 C581 169 566 214 541 242 C521 262 494 265 473 250 C444 229 425 184 425 144 C425 124 426 107 429 96 Z" },
  { name: "Ears", d: "M422 143 C406 141 406 171 426 185 L435 174 Z M568 144 C587 138 594 165 577 183 L567 173 Z" },
  { name: "Eyebrows", d: "M449 131 Q468 119 485 132 L482 139 Q465 132 451 140 Z M519 130 Q540 119 555 133 L552 140 Q536 132 520 139 Z" },
  { name: "Eyes", d: "M447 145 Q465 132 486 146 Q470 163 449 153 Z M515 145 Q535 132 556 145 Q540 163 518 154 Z" },
  { name: "Eyelashes", d: "M444 143 Q465 127 489 144 L486 149 Q465 137 447 149 Z M513 143 Q536 127 560 143 L557 149 Q536 137 516 149 Z" },
  { name: "Cheeks", d: "M440 166 Q455 157 470 168 Q465 185 447 185 Z M535 166 Q550 157 565 168 L558 185 Q541 185 535 166 Z" },
  { name: "Nose", d: "M490 151 Q498 166 496 178 Q501 184 510 179 Q502 187 493 182 Q491 178 493 172 Z" },
  { name: "Lips", d: "M483 192 Q500 184 518 193 Q502 207 484 197 Z" },
  { name: "Neck", d: "M463 238 Q495 258 532 238 L545 303 Q505 320 455 299 Z" },
  { name: "Shoulders", d: "M443 276 Q408 277 374 303 L352 354 L398 383 L456 331 Z M535 276 Q570 277 600 306 L625 357 L579 383 L526 330 Z" },
  { name: "Arms", d: "M372 311 Q348 320 334 352 L333 476 Q344 526 390 570 L447 713 L472 780 L505 782 L493 724 L462 624 L430 518 L416 395 Z M599 316 Q624 325 638 363 L641 493 Q626 535 594 571 L577 655 L568 736 L548 784 L518 780 L526 720 L541 622 L552 519 L560 395 Z" },
  { name: "Hands", d: "M493 767 Q514 779 542 770 L581 792 Q591 821 571 850 Q551 868 529 850 L501 837 Q482 819 493 767 Z" },
  { name: "Fingernails", d: "M501 819 Q508 815 514 823 L511 833 Q503 835 500 829 Z M515 830 Q521 824 527 831 L524 841 Q516 842 514 837 Z M530 834 Q537 829 542 836 L539 846 Q532 847 529 842 Z M545 829 Q552 824 557 831 L554 840 Q547 842 544 837 Z M559 817 Q566 813 570 820 L567 830 Q561 832 558 827 Z" },
  { name: "Underarms", d: "M411 326 Q430 324 448 347 L437 378 Q418 371 405 356 Z M548 347 Q566 324 584 326 L590 356 Q576 371 558 378 Z" },
  { name: "Chest", d: "M388 316 Q421 294 462 300 Q495 321 522 300 Q566 296 596 319 L580 471 L568 615 L407 616 L392 469 Z" },
  { name: "Abdomen", d: "M410 486 Q492 500 578 485 L571 626 L411 626 Z" },
  { name: "Hips", d: "M390 607 Q492 623 592 605 L626 883 Q607 953 490 962 Q374 947 355 884 Z" },
  { name: "Thighs", d: "M381 936 Q435 949 484 954 L475 1130 L448 1205 Q414 1226 385 1194 L370 1073 Z M493 954 Q548 948 614 935 L628 1070 L611 1194 Q582 1226 548 1205 L518 1128 Z" },
  { name: "Knees", d: "M389 1174 Q423 1197 454 1178 L444 1258 Q413 1274 385 1248 Z M542 1178 Q574 1197 609 1174 L613 1248 Q583 1274 551 1258 Z" },
  { name: "Legs", d: "M389 1231 Q414 1252 444 1243 L439 1432 L455 1510 L416 1532 L388 1491 L377 1360 Z M553 1243 Q583 1252 609 1231 L621 1360 L610 1491 L583 1532 L546 1510 L560 1432 Z" },
  { name: "Feet", d: "M409 1473 Q442 1477 456 1515 L477 1553 Q478 1588 450 1599 L411 1589 Q392 1575 395 1542 Z M548 1515 Q563 1477 595 1473 L610 1542 Q613 1575 594 1589 L555 1599 Q527 1588 528 1553 Z" },
  { name: "Toes", d: "M400 1544 Q426 1531 455 1554 L476 1577 Q470 1600 448 1601 L411 1593 Q393 1579 400 1544 Z M548 1554 Q578 1531 604 1544 Q611 1579 593 1593 L556 1601 Q534 1600 528 1577 Z" },
  { name: "Toenails", d: "M400 1544 Q426 1531 455 1554 L476 1577 Q470 1600 448 1601 L411 1593 Q393 1579 400 1544 Z M548 1554 Q578 1531 604 1544 Q611 1579 593 1593 L556 1601 Q534 1600 528 1577 Z" },
];

const areaChoices = [
  "Hair", "Face", "Eyes", "Eyebrows", "Eyelashes", "Nose", "Lips", "Cheeks", "Ears",
  "Neck", "Shoulders", "Arms", "Underarms", "Hands", "Fingernails", "Chest", "Abdomen",
  "Back", "Hips", "Thighs", "Knees", "Legs", "Feet", "Toes", "Toenails",
];

const smallAreas = [
  { name: "Underarms", caption: "Area is under sleeves", icon: "underarms" },
  { name: "Fingernails", caption: "Both hands · nails grouped", icon: "hands" },
  { name: "Toenails", caption: "Toe area · under footwear", icon: "toes" },
];

function AreaSketch({ type }) {
  if (type === "underarms") {
    return (
      <svg className="small-area-sketch" viewBox="0 0 72 56" aria-hidden="true">
        <path d="M24 7 Q36 1 48 7 L55 18 L49 25 L47 49 L25 49 L23 25 L17 18 Z" fill="#e9afc5" stroke="#a65a7e" strokeWidth="2" />
        <path d="M20 14 L8 24 L14 35 M52 14 L64 24 L58 35" fill="none" stroke="#a65a7e" strokeWidth="5" strokeLinecap="round" />
        <circle cx="22" cy="22" r="4" fill="#be638b" /><circle cx="50" cy="22" r="4" fill="#be638b" />
      </svg>
    );
  }

  if (type === "hands") {
    return (
      <svg className="small-area-sketch" viewBox="0 0 72 56" aria-hidden="true">
        <path d="M23 48 Q18 45 19 37 L20 22 Q20 18 23 18 Q26 18 26 22 L27 12 Q27 8 30 8 Q33 8 33 12 L34 9 Q37 6 39 10 L40 14 Q43 11 45 15 L46 26 Q52 24 53 29 L51 42 Q49 49 42 50 Z" fill="#f3b895" stroke="#bd785e" strokeWidth="1.5" />
        <path d="M23 19 L23 24 M30 10 L30 15 M37 9 L37 14 M44 14 L44 19" stroke="#f7dbe6" strokeWidth="3" strokeLinecap="round" />
        <path d="M24 19 L24 22 M31 10 L31 13 M38 9 L38 12 M45 14 L45 17" stroke="#b6577d" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className="small-area-sketch" viewBox="0 0 72 56" aria-hidden="true">
      <path d="M14 43 Q12 37 17 30 L26 18 Q30 14 33 18 Q35 21 31 26 L42 24 Q48 24 51 29 L57 38 Q59 44 53 48 L25 50 Q17 50 14 43 Z" fill="#f3b895" stroke="#bd785e" strokeWidth="1.5" />
      <ellipse cx="20" cy="29" rx="3.5" ry="5" fill="#f3b895" stroke="#bd785e" strokeWidth="1" />
      <ellipse cx="26" cy="21" rx="3.5" ry="4.5" fill="#f3b895" stroke="#bd785e" strokeWidth="1" />
      <ellipse cx="33" cy="20" rx="3" ry="4" fill="#f3b895" stroke="#bd785e" strokeWidth="1" />
      <ellipse cx="40" cy="25" rx="3" ry="3.5" fill="#f3b895" stroke="#bd785e" strokeWidth="1" />
      <ellipse cx="46" cy="30" rx="2.5" ry="3" fill="#f3b895" stroke="#bd785e" strokeWidth="1" />
      <path d="M18 28 l3 -1 M25 20 l3 -1 M32 19 l2 -1 M39 24 l2 -1 M45 29 l2 -1" stroke="#b6577d" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function AnimeGirlMap({ selectedArea, onSelectArea, onKeyDown }) {
  return (
    <div className="anime-map-wrap">
      <svg className="anime-girl-map" viewBox="0 0 975 1614" role="group" aria-label="Interactive front-view anime girl body map">
        <image href={animeGirl} x="0" y="0" width="975" height="1614" preserveAspectRatio="xMidYMid meet" />
        {clickableRegions.map(({ name, d }) => (
          <path
            key={name}
            d={d}
            className={`anime-hit-area ${selectedArea === name ? "anime-area-selected" : ""}`}
            onClick={() => onSelectArea(name)}
            onKeyDown={(event) => onKeyDown(event, name)}
            role="button"
            tabIndex={0}
            aria-label={`Select ${name}`}
          >
            <title>{name}</title>
          </path>
        ))}
      </svg>
      <section className="small-area-panel" aria-labelledby="small-area-heading">
        <h3 id="small-area-heading">Small and covered areas</h3>
        <p>Choose a close-up selector for areas that are hard to see in the full illustration.</p>
        <div className="small-area-selectors">
          {smallAreas.map(({ name, caption, icon }) => (
            <button
              key={name}
              type="button"
              className={`small-area-card ${selectedArea === name ? "small-area-card-selected" : ""}`}
              aria-pressed={selectedArea === name}
              onClick={() => onSelectArea(name)}
            >
              <AreaSketch type={icon} />
              <span>{name}</span>
              <small>{caption}</small>
            </button>
          ))}
        </div>
      </section>
      <p className="anime-map-note">Front-view illustration · click a highlighted part or choose an area below. Some areas are covered by the outfit.</p>
      <div className="anime-area-choices" role="group" aria-label="Choose an area">
        {areaChoices.map((name) => (
          <button
            key={name}
            type="button"
            className={selectedArea === name ? "anime-choice-selected" : ""}
            onClick={() => onSelectArea(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <p className="anime-map-limitation">This is a single 2D front view, not a rotatable model. Underarms are covered by sleeves and toenails by socks and shoes. The close-up sketches are selection guides; they do not add geometry to the character. Fingernails and toenails are grouped, not individually selectable.</p>
    </div>
  );
}
