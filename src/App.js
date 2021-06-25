import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, Snackbar, Avatar, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { Icon24Error } from '@vkontakte/icons';
import recipes from './recipes.json'; 

import Home from './panels/Home';
import Intro from './panels/Intro';
import Recipe from './panels/Recipe';

import pic1 from './img/1.jpg';
import pic2 from './img/2.jpg';
import pic3 from './img/3.jpg';
import pic4 from './img/4.jpeg';
import pic5 from './img/5.jpeg';
import pic6 from './img/6.jpg';
import pic7 from './img/7.jpeg';
import pic8 from './img/8.jpeg';
import pic9 from './img/9.jpg';
import pic10 from './img/10.jpg';

recipes.items[0].pic = pic1;
recipes.items[1].pic = pic2;
recipes.items[2].pic = pic3;
recipes.items[3].pic = pic4;
recipes.items[4].pic = pic5;
recipes.items[5].pic = pic6;
recipes.items[6].pic = pic7;
recipes.items[7].pic = pic8;
recipes.items[8].pic = pic9;
recipes.items[9].pic = pic10;

const allIngredients = [];

for (let item of recipes.items) {
	for (let ingredient of item.ingredients)
	{
		if (ingredient.indexOf(' -') != -1)
		{
			allIngredients.push(ingredient.substring(0, ingredient.indexOf(' -')));	
		}
		else
		{
			allIngredients.push(ingredient);
		}
	}
}

const ingredientsSet = new Set(allIngredients.sort());

const ingredientsList = [];

var i = 0;
for (let item of ingredientsSet) {
	ingredientsList.push({value: i, label: item});
	i++;
}

const ROUTES = {
	HOME: 'home',
	INTRO: 'intro',
	RECIPE: 'recipe'
}

const STORAGE_KEYS = {
	STATUS: 'status',
}

const App = () => {
	const [activePanel, setActivePanel] = useState(ROUTES.INTRO);
	const [fetchedUser, setUser] = useState(null);
	const [recipeId, setRecipeId] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [userHasSeenIntro, setUserHasSeenIntro] = useState(false);
	const [snackbar, setSnackbar] = useState(false);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			const storageData = await bridge.send('VKWebAppStorageGet', {
				keys: Object.values(STORAGE_KEYS)
			});
			const data = {};
			storageData.keys.forEach(({key, value}) => {
				try {
					data[key] = value ? JSON.parse(value) : {};
					switch (key) {
						case STORAGE_KEYS.STATUS: 
							if (data[key].hasSeenIntro) {
								setActivePanel(ROUTES.INTRO);
								setUserHasSeenIntro(true);
							}
							break;
						default: 
							break;
					}
				} catch(error) {
					setSnackbar(<Snackbar
						layout='vertical'
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={{backgroundColor: 'var(--dynamic-red)'}}
						><Icon24Error fill='#fff' width='14' height='14'/></Avatar>}
						duration={900}
					>
						Проблема с получением данных из Storage
					</Snackbar>);
				}
			})
			setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);

	const goToPanel = panel => {
		setActivePanel(panel);
	};

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
		if (e.currentTarget.dataset.to == "recipe")
		{
			setRecipeId(e.currentTarget.id);
		}
	};

	const viewIntro = async function () {
		try {
			await bridge.send('VKWebAppStorageSet', {
				key: STORAGE_KEYS.STATUS,
				value: JSON.stringify({
					hasSeenIntro: true
				})
			});
			goToPanel(ROUTES.HOME);
		} catch(error) {
			setSnackbar(<Snackbar
				layout='vertical'
				onClose={() => setSnackbar(null)}
				before={<Avatar size={24} style={{backgroundColor: 'var(--dynamic-red)'}}
				><Icon24Error fill='#fff' width='14' height='14'/></Avatar>}
				duration={900}
			>
				Проблема с отправкой данных в Storage
			</Snackbar>);
		}
	}

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout}>
					<Home id={ROUTES.HOME} go={go} snackbarError={snackbar} ingredientsList={ingredientsList} />
					<Intro id={ROUTES.INTRO} fetchedUser={fetchedUser} go={viewIntro} snackbarError={snackbar} userHasSeenIntro={userHasSeenIntro}/>
					<Recipe id={ROUTES.RECIPE} go={go} recipeId={recipeId} />
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
