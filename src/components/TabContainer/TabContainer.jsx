import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tabs } from "@mui/material";
import React from "react";
import { HashIndex } from "./Tabs/HashIndex";
import Statistics from "./Tabs/Statistics/Statistics";
import { tabList, tabListStyle, tabPanelStyle, tabsStyle } from "./constants";

const TabContainer = () => {

	const [value, setValue] = React.useState('1')

	const handleChangeTab = (event, newValue) => {
		setValue(newValue)
	}

	const tabs = [
		{ tabContent: <HashIndex />, value: '1' },
		{ tabContent: <Statistics />, value: '2' },
	]

    return (
        <TabContext value={value}>
            <TabList 
				onChange={handleChangeTab}
				sx={tabListStyle}
			>
				{tabList.map(tab => tab.component)}
			</TabList>
			{tabs.map(tab => (
				<TabPanel
					key={'tabPanel - ' + tab.value}
					value={tab.value}
					sx={tabPanelStyle}
				>
					<Tabs
						indicatorColor='white'
						sx={tabsStyle}
						value={false}
					>
						{tab.tabContent}
					</Tabs>
				</TabPanel>
			))}
        </TabContext>
    );
};

export default TabContainer;

