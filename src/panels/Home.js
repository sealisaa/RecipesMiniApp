import React from 'react';
import ReactDOM from "react-dom";
import "@vkontakte/vkui/dist/vkui.css";
import { PanelHeader, PanelHeaderButton, Group, Search, SimpleCell, Footer, Chip, ContentCard, CardGrid, Div, Button, FormItem, CustomSelectOption} from '@vkontakte/vkui';
import ChipsSelect from '@vkontakte/vkui/dist/components/ChipsSelect/ChipsSelect';
import './Home.css';
import recipes from '../recipes.json'; 

class RecipeCard extends React.Component {

	constructor(props) {
		super(props);
	}

    render() {
    	var go = this.props.go;
        return <ContentCard
        		disabled
                image = {this.props.pic}
                header = {this.props.name}
                text = <Div className="IngredientsContainer">
                			<ol className="Ingredients">
                	   			{this.props.ingredients.map(function(item) {
                            	return <li key={item}>{item}</li>
                    			})}
                	   		</ol>
                	   	</Div>
                caption = <Button id={this.props.id} mode="secondary" onClick={go} data-to="recipe">Подробнее</Button>
                maxHeight={250}/>
    }
}
         
class SearchRecipes extends React.Component {
             
    constructor(props) {
        super(props);
        this.onTextChanged = this.onTextChanged.bind(this);
    }
             
    onTextChanged(e) {
        var text = e.target.value.trim();
        this.props.filter(text);
    }
             
    render() {
        return <Search className="SearchRecipes" onChange={this.onTextChanged} />;
    }
}

const SelectIngredients = ({ ingredientsList, filter }) => {

  const [selectedIngredients, setSelectedIngredients] = React.useState([]);
  const ingredientsChipsProps = {
    value: selectedIngredients,
    options: ingredientsList,
    placeholder: "Не выбраны",
    emptyText: 'Ничего не найдено',
  };

  return (
    <FormItem top="Выберите ингредиенты">
            <ChipsSelect
              {...ingredientsChipsProps}
              showSelected={false}
              closeAfterSelect={false}
              onChange = {(e) => {
                var ingredientsToFilter = [];
                for (let ingredient of e)
                {
                    ingredientsToFilter.push(ingredient.label);
                }
                setSelectedIngredients(e);
                filter(ingredientsToFilter);
              }}
              renderChip={({ value, label, ...rest }) => (
                <Chip value={value} {...rest}>
                  {label}
                </Chip>
              )}
              renderOption={({ option: {value}, ...otherProps }) => {
                return (
                  <CustomSelectOption {...otherProps} />
                );
              }}
            />
          </FormItem>
  );
}
                  
class RecipeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { items: this.props.data.items};  
        this.ingredientsOK = {items: this.props.data.items};  
        this.searchOK = {items: this.props.data.items};  
        this.filterList = this.filterList.bind(this);
        this.filterIngredients = this.filterIngredients.bind(this);
        this.searchIsEmpty = null;
        this.listIsEmpty = null;
    }
             
    filterList(text) {
        var filteredList;
        if (text == "")
        {
            this.searchIsEmpty = true;
            if (this.listIsEmpty == true)
            {
                filteredList = this.props.data.items;  
                this.searchOK = {items: filteredList};
                this.ingredientsOK = {items: filteredList};  
            }
            else
            {
                filteredList = this.ingredientsOK.items;
            }
        }
        else
        {
            this.searchIsEmpty = false;
            filteredList = this.ingredientsOK.items.filter(function(item) {
                return item.name.toLowerCase().search(text.toLowerCase()) !== -1;
            });
        }
        this.setState({items: filteredList});
        this.searchOK = {items: filteredList};
    }

    filterIngredients(selectedIngredients) {
        console.log(selectedIngredients);
        var filteredList = [];
        if (selectedIngredients.length == 0)
        {
            this.listIsEmpty = true;
            console.log(this.searchOK.items);
            if (this.searchIsEmpty == true)
            {
                filteredList = this.props.data.items;
                this.searchOK = {items: filteredList};
                this.ingredientsOK = {items: filteredList}; 
            }
            else
            {
                filteredList = this.searchOK.items;
            }
        }
        else
        {
            this.listIsEmpty = false;
            for (let item of this.searchOK.items) {
            let flag = true;
            let recipeIngredients = [];
            for (let ingredient of item.ingredients)
            {
                if (ingredient.indexOf(' -') != -1) {
                    recipeIngredients.push(ingredient.substring(0, ingredient.indexOf(' -'))); 
                }
                else {
                    recipeIngredients.push(ingredient);
                }
            }
            for (let ingredient of selectedIngredients)
            {
                if (recipeIngredients.indexOf(ingredient) == -1)
                {
                    flag = false;
                    break;
                }
            }
            if (flag == true)
            {
                filteredList.push(item);
            }

        }
        }
        this.setState({items: filteredList});
        this.ingredientsOK = {items: filteredList};
    }
              
    render() {
    	var go = this.props.go;
        return(
            <div>         
                <SearchRecipes filter={this.filterList} />
                <SelectIngredients ingredientsList={this.props.ingredientsList} filter={this.filterIngredients} />
                <Group>
                	<CardGrid size="l">
                    	{this.state.items.length > 0 && this.state.items.map(function(item) {
                            return <RecipeCard key={item.id} id={item.id} name={item.name} pic={item.pic} ingredients={item.ingredients} go={go}/>
                    	})}
                    </CardGrid>
                    {this.state.items.length === 0 && <Footer>Ничего не найдено</Footer>}
                </Group>
            </div>);
    }
}

const Home = ({ go, ingredientsList }) => (

    <React.Fragment>
        <PanelHeader>
        	Рецептики
        </PanelHeader>
        <RecipeList data={recipes} go={go} ingredientsList={ingredientsList} />
    </React.Fragment>
)

export default Home;

