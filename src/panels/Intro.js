import React, { Fragment } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Group, Div, Avatar, FixedLayout, Button, Cell, List, Text } from '@vkontakte/vkui';
import './Intro.css';
import { Icon28AppleOutline } from '@vkontakte/icons';
import { Icon28FavoriteOutline } from '@vkontakte/icons';
import { Icon28BillheadOutline } from '@vkontakte/icons';
import { Icon56GhostOutline } from '@vkontakte/icons';

const Intro = ({id, snackbarError, fetchedUser, userHasSeenIntro, go}) => {
	return (
		<Panel id={id} centered="true">
		{(fetchedUser) && 
			<Fragment>
				<Group>
					<Div className='Intro'>
						<Icon56GhostOutline fill="var(--accent)"/>
						<h2>Привет, {fetchedUser.first_name}!</h2>
						<div className="FlexContainer" centered="true">
							<Avatar className="AvatarIcon" style={{ background: 'var(--background_content)' }} size={28} shadow={false}><Icon28AppleOutline fill="var(--accent)" /></Avatar>
							<div>Просматривай рецепты</div>
						</div>
						<div className="FlexContainer">
							<Avatar className="AvatarIcon" style={{ background: 'var(--background_content)' }} size={28} shadow={false}><Icon28BillheadOutline fill="var(--accent)" /></Avatar>
							<div>Ищи рецепты по ключевым словам и ингредиентам</div>
						</div>
						<div className="FlexContainer">
							<Avatar className="AvatarIcon" style={{ background: 'var(--background_content)' }} size={28} shadow={false}><Icon28FavoriteOutline fill="var(--accent)" /></Avatar>
							<div>Сохраняй понравившиеся рецепты</div>
						</div>
						<Button size="l" onClick={go}>
							Ок, все понятно
						</Button>
					</Div>
				</Group>
			</Fragment>
		}
		{snackbarError}
		</Panel>	
	)
};

export default Intro;
