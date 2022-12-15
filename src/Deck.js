import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

let url = 'https://deckofcardsapi.com/api/deck';

const Deck = () => {
	const [ deck, setDeck ] = useState(null);
	const [ drawn, setDrawn ] = useState([]);
	const [ autoDraw, setAutoDraw ] = useState(false);
	const timerRef = useRef(null);

	// async function fetchDeck() {
	//     const res = await axios.get(`${url}`);
	//     let deckId =res.data.deck_id
	//     let deckData = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`);
	//     setDeck(deckData.data.cards[0]);
	//     console.log(deckData.data.cards[0])
	//   }
	//onClick={fetchDeck}

	useEffect(
		function fetchDeckOnClickChange() {
			async function fetchDeck() {
				const res = await axios.get(`${url}/new/shuffle/`);
				setDeck(res.data);
			}

			fetchDeck();
		},
		[ setDeck ]
	);

	useEffect(
		function fetchCardOnChange() {
			async function fetchCard() {
				let { deck_id } = deck;
				try {
					let deckData = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/`);

					if (deckData.data.remaining === 0) {
						setAutoDraw(false);
						noMore();
					}

					const drawnCard = deckData.data.cards[0];
                    console.log(drawnCard)
					setDrawn(drawnCard );
				} catch (err) {
					return err;
				}
			} 

//current value of the Ref = timerRef.current
			if (autoDraw && !timerRef.current) {
				timerRef.current = setInterval(async () => {
					await fetchCard();
				}, 1000);
			}
			return () => {
                //prevent memory leaks
				clearInterval(timerRef.current);
				timerRef.current = null;
			};
		},
		[ deck, autoDraw ]
	);
	const toggleAutoDraw = () => {
		setAutoDraw((auto) => !auto);
	};

	const noMore = () => {
		alert('Error: no cards remaining!');
	};

	return (
		<div className="mainDeck" onClick={toggleAutoDraw}>
			{deck ? <button>{autoDraw ? 'Stop' : 'Draw'} !</button> : null}
            <div><img src={drawn.image} alt=""/> </div>
            
		</div>
	);
};

export default Deck;
