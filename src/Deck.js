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
					console.log(drawnCard);
                    // await so the api call happens and we get deck_id else runs the same time
					setDrawn(drawnCard);
				} catch (err) {
					return err;
				}
			}

			//current value of the Ref = timerRef.current
			//timer currently not running then setInterval else remove it
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

	// Initial state: autoDraw = false
	// setAutoDraw((auto) => !auto)
	// setAutoDraw((now auto equals to) => !false)

	const toggleAutoDraw = () => {
		setAutoDraw((auto) => !auto);
	};
	// called is card in deck remaining 0
	const noMore = () => {
		alert('Error: no cards remaining!');
	};

	return (
		<div className="mainDeck" onClick={toggleAutoDraw}>
			{/* if deck is true add button, if autodraw true add stop else draw */}
			{deck ? <button>{autoDraw ? 'Stop' : 'Draw'} !</button> : null}
			<div>
				<img src={drawn.image} alt="" />{' '}
			</div>
		</div>
	);
};

export default Deck;
