import React from 'react';
import ReactDOM from "react-dom";
import "@vkontakte/vkui/dist/vkui.css";
import { Panel, PanelHeader, PanelHeaderBack, Group, Div, SimpleCell, Banner } from '@vkontakte/vkui';
import recipes from '../recipes.json';
import { Icon24SartOutline } from '@vkontakte/icons';
import { Icon24AppleOutline } from '@vkontakte/icons';
import './Recipe.css';

class RecipeText extends React.Component {

	render() {

		console.log(recipes.items[this.props.recipeId]);
		return (
			<div>Класс</div>
		)
	}
}

const Recipe = ({ recipeId, go }) => {
	return (
	<Panel id={recipeId}>
		{ recipeId &&
			<React.Fragment>
        		<PanelHeader left={<PanelHeaderBack onClick={go} data-to="home"/>}>
					{recipeId && recipes.items[recipeId].name}
				</PanelHeader>
				<Group>
					<Div>
						<SimpleCell disabled before={<Icon24SartOutline />}>
						Ингредиенты
						</SimpleCell>
						<ol>
                			{recipes.items[recipeId].ingredients.map(function(item) {
                           	return <li className="LiItem" key={item}>{item}</li>
                    		})}
                		</ol>
                		<SimpleCell disabled before={<Icon24AppleOutline />}>
							Как готовить
						</SimpleCell>
						<ol>
                			{recipes.items[recipeId].howto.map(function(item) {
                           	return <li className="LiItem" key={item}>{item}</li>
                    		})}
                		</ol>
					</Div>
				</Group>
    		</React.Fragment>}
    	</Panel>
    )
}

export default Recipe;