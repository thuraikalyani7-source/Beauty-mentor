import animeBoy from "../assets/anime-boy.png";

const areas = [
  "Hair", "Face", "Eyes", "Eyebrows", "Eyelashes", "Nose", "Lips", "Cheeks", "Ears",
  "Neck", "Shoulders", "Arms", "Underarms", "Hands", "Chest", "Abdomen",
  "Back", "Hips", "Thighs", "Knees", "Legs", "Feet", "Toes", "Toenails",
];

// These SVG paths are drawn over the matching parts of the supplied illustration.
const regions = [
  ["Hair", "M432 75 Q510 48 591 88 L625 173 L589 226 L450 214 L422 164 Z"],
  ["Face", "M461 152 Q510 127 569 157 L558 255 Q520 282 482 252 Z"],
  ["Eyes", "M469 181 Q487 171 503 184 L498 196 L472 193 Z M526 183 Q543 174 558 187 L551 198 L529 195 Z"],
  ["Eyebrows", "M468 173 Q486 164 504 176 L500 182 L471 181 Z M524 176 Q542 165 559 178 L557 184 L526 183 Z"],
  ["Eyelashes", "M468 181 Q486 169 503 184 L500 190 Q484 178 471 190 Z M525 183 Q542 170 559 184 L555 190 Q541 178 528 191 Z"],
  ["Nose", "M506 185 L520 185 L521 221 L510 222 Z"],
  ["Lips", "M499 232 Q513 226 529 232 Q516 243 501 237 Z"],
  ["Cheeks", "M466 207 Q485 199 495 214 L489 230 L470 225 Z M535 214 Q549 198 565 207 L559 226 L540 230 Z"],
  ["Ears", "M450 176 Q463 168 466 194 L455 209 L444 198 Z M563 183 Q577 168 584 184 L581 202 L565 207 Z"],
  ["Neck", "M481 254 L554 250 L573 306 L469 315 Z"],
  ["Shoulders", "M420 253 L476 263 L470 371 L347 421 L312 367 L374 294 Z M561 263 L620 264 L685 300 L725 370 L666 419 L549 371 Z"],
  ["Arms", "M323 329 L380 354 L306 432 L195 416 L171 389 L207 356 L284 380 Z M697 355 L774 380 L850 355 L887 385 L862 415 L750 432 L674 381 Z"],
  ["Underarms", "M372 364 Q405 352 431 386 L408 425 L369 410 Z M592 385 Q618 351 650 365 L653 412 L613 426 Z"],
  ["Hands", "M4 304 Q25 297 54 314 L103 341 L171 363 L193 392 L181 420 L111 399 L41 368 L6 338 Z M834 363 L902 341 L970 306 Q996 297 1018 308 L1017 339 L979 369 L910 399 L843 420 L828 392 Z"],
  ["Chest", "M391 300 Q505 281 612 301 L642 491 L603 591 L414 590 L374 490 Z"],
  ["Abdomen", "M402 472 L628 472 L636 628 L390 628 Z"],
  ["Hips", "M394 580 L624 580 L638 702 L386 702 Z"],
  ["Thighs", "M390 660 L503 660 L509 980 L483 1120 L364 1062 L357 814 Z M512 660 L635 660 L641 816 L629 1062 L517 1120 L503 979 Z"],
  ["Knees", "M367 1022 L490 1051 L482 1168 L371 1155 Z M517 1051 L638 1022 L633 1155 L524 1168 Z"],
  ["Legs", "M371 1123 L482 1132 L477 1336 L460 1434 L432 1444 L421 1391 L389 1285 Z M524 1132 L633 1123 L616 1285 L585 1391 L572 1444 L543 1434 L527 1336 Z"],
  ["Feet", "M461 1370 Q481 1381 490 1414 L478 1470 L461 1494 L438 1466 L450 1404 Z M543 1370 Q566 1378 573 1406 L588 1467 L568 1493 L545 1471 L529 1414 Z"],
  ["Toes", "M444 1425 L482 1439 L478 1472 L460 1488 L439 1467 Z M548 1437 L581 1423 L588 1466 L568 1488 L548 1471 Z"],
];

// A silhouette clip hides the supplied dark studio backdrop without altering the source art.
const silhouette = "M496 69 Q523 62 546 83 L584 95 L608 136 L620 197 L597 249 L622 255 L676 286 L746 302 L837 358 L887 346 L944 310 L968 302 L990 310 L1015 327 L1003 350 L960 376 L914 400 L859 420 L822 418 L795 400 L759 422 L715 438 L675 417 L637 392 L627 485 L637 548 L642 620 L631 662 L637 748 L647 847 L640 944 L646 1040 L628 1110 L631 1175 L621 1264 L601 1343 L587 1412 L620 1469 L623 1496 L601 1513 L536 1508 L487 1490 L466 1473 L449 1432 L419 1390 L394 1339 L370 1267 L357 1185 L357 1081 L360 980 L356 877 L359 779 L370 683 L374 619 L385 548 L378 476 L365 408 L331 427 L290 440 L247 419 L208 404 L177 419 L137 401 L88 376 L33 350 L7 332 L18 310 L38 302 L61 309 L116 345 L167 365 L197 378 L238 360 L287 306 L362 281 L409 255 L427 200 L418 145 L444 95 Z";

export default function AnimeBoyMap({ selectedArea, onSelectArea, onKeyDown }) {
  return (
    <div className="anime-map-wrap anime-boy-map-wrap">
      <svg className="anime-girl-map anime-boy-map" viewBox="0 0 1024 1536" role="group" aria-label="Interactive front-view anime boy body map">
        <defs>
          <clipPath id="anime-boy-silhouette"><path d={silhouette} /></clipPath>
        </defs>
        <image href={animeBoy} x="0" y="0" width="1024" height="1536" preserveAspectRatio="xMidYMid meet" clipPath="url(#anime-boy-silhouette)" />
        {regions.map(([name, d]) => (
          <path key={name} d={d} className={`anime-hit-area ${selectedArea === name ? "anime-area-selected" : ""}`} onClick={() => onSelectArea(name)} onKeyDown={(event) => onKeyDown(event, name)} role="button" tabIndex={0} aria-label={`Select ${name}`}><title>{name}</title></path>
        ))}
      </svg>
      <p className="anime-map-note">Front-view illustration · click a body area or use the buttons. The original male body map is still available above.</p>
      <div className="anime-area-choices" role="group" aria-label="Choose a boy body area">
        {areas.map((name) => <button key={name} type="button" className={selectedArea === name ? "anime-choice-selected" : ""} aria-pressed={selectedArea === name} onClick={() => onSelectArea(name)}>{name}</button>)}
      </div>
      <p className="anime-map-limitation">Covered areas such as underarms, chest, and abdomen can be chosen from the list. Select Hands for general hand care; this illustration does not have a separate fingernail selector. This is a 2D front view.</p>
    </div>
  );
}
