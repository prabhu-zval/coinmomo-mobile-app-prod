import { createContext, useState } from 'react';
import React from 'react'
import moment from 'moment';

export const LoginContext = createContext()
export const Provider = (props) => {
    const [derivativesData, setDerivativesData] = useState(null)
    const [dollarvalue, setdollarvalue] = useState(0)
    const [marketData, setMarketData] = useState(null)
    const [exchangesData, setExchangesData] = useState(null)
    const [eventData, setEventData] = useState(null)
    const [pastEvents, setPastEvents] = useState([])
    const [highlights, setHighlights] = useState(null)
    const [screenLoading, setScreenLoading] = useState(false)
    const [assetsData, setAssetsData] = useState('')
    const [userLogin, setUserLogin] = useState(false)
    const [tableData, setTableData] = useState('')
    const [showData, setShowData] = useState([])
    const [currentTab, setCurrentTab] = useState('Buy')
    const [quantity, setQuantity] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [pricePerCoin, setPricePerCoin] = useState(null)
    const [fee, setFee] = useState('')
    const [notes, setNotes] = useState('')
    const [date, setDate] = useState(moment().format("YYYY-MM-DD, h:mm a"))
    const [coinName, setCoinName] = useState({})
    const [pricePercentage, setPricePercentage] = useState(null)
    const [symbol, setSymbol] = useState('')
    const [quantityError, setQuantityError] = useState('')
    const [transactionImage, setTransactionImage] = useState(null)
    const [userSigninId, setUserSigninId] = useState('')
    const [loginLoading, setLoginLoading] = useState(false)
    const [userDetails,setUserDetails]=useState({})
    const [sortBy,setSortBy]=useState(null)
    const [pageLoading,setPageLoading]=useState(false)
    const [sortTitle, setSortTitle]=useState('')
    const [sortCategory, setSortCategory]=useState('')
    const [sortCommunity,setSortCommunity]=useState('')
    const [sortTags,setSortTags]=useState([])
    const [portfolioData, setPortfolioData] = useState([])
    const [sortDate,setSortDate]=useState('')
    const [titleValue, setTitleValue] = useState(null)
    const [categoryValueItem, setCategoryvalueItem] = useState(null)
    const [communityValueItem, setCommunityValueItem] = useState(null)
    const [tagsValue, setTagsValue] = useState(null)
    const [dateValueItem, setDatevalueItem] = useState(null)
    const [replyCount,setReplyCount]=useState(0)
    const [popupBackground, setPopupBackground] = useState(false)
    const [conversionValue,setConversionValue]=useState('')
    const [conversionPrice,setConversionPrice]=useState(0)
    const [assetsCoin,setAssetsCoin]=useState('')
    const [assetsCoinImage,setAssetsCoinImage]=useState(null)
    const [conversionRate,setConversionRate]=useState([])
    const [conversionBgColor,setConversionBgColor]=useState(null)
    const [marketCapFilter,setMarketCapFilter]=useState([])
    const [marketCapBgColor,setMarketCapBgColor]=useState(null)
    const [marketCapFilterValue,setMarketCapFilterValue]=useState(null)
    const [currentprice,setCurrentPrice]=useState(0)
    const [assetsPrice,setAssetsPrice]=useState(0)
    const [assetsCoinId, setAssetsCoinId] = useState("")
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [drawerBgColor, setDrawerBgColor] = useState("")

    return (
        <LoginContext.Provider value={{
            derivativesData,
            setDerivativesData,
            dollarvalue,
            setdollarvalue,
            marketData,
            setMarketData,
            exchangesData,
            setExchangesData,
            eventData,
            setEventData,
            pastEvents,
            setPastEvents,
            highlights,
            setHighlights,
            screenLoading,
            setScreenLoading,
            userLogin,
            setUserLogin,
            setScreenLoading,
            assetsData, setAssetsData,
            tableData, setTableData,
            showData, setShowData,
            currentTab, setCurrentTab,
            quantity, setQuantity,
            transactions, setTransactions,
            pricePerCoin, setPricePerCoin,
            fee, setFee,
            date, setDate,
            notes, setNotes,
            coinName, setCoinName,
            pricePercentage, setPricePercentage,
            symbol, setSymbol,
            quantityError, setQuantityError,
            transactionImage, setTransactionImage,
            userSigninId, setUserSigninId,
            loginLoading, setLoginLoading,
            portfolioData, setPortfolioData,
            userDetails,setUserDetails,
            sortBy,setSortBy,
            sortTitle,setSortTitle,
            sortCategory,setSortCategory,
            sortCommunity,setSortCommunity,
            sortTags,setSortTags,
            pageLoading,setPageLoading,
            sortDate,setSortDate,
            titleValue, setTitleValue,
            categoryValueItem, setCategoryvalueItem,
            communityValueItem, setCommunityValueItem,
            tagsValue, setTagsValue,
            dateValueItem, setDatevalueItem,
            replyCount,setReplyCount,
            popupBackground,setPopupBackground,
            conversionValue,setConversionValue,
            conversionPrice,setConversionPrice,
            assetsCoin,setAssetsCoin,
            assetsCoinImage,setAssetsCoinImage,
            conversionRate,setConversionRate,
            conversionBgColor,setConversionBgColor,
            marketCapFilter,setMarketCapFilter,
            marketCapBgColor,setMarketCapBgColor,
            marketCapFilterValue,setMarketCapFilterValue,
            currentprice,setCurrentPrice,
            assetsPrice,setAssetsPrice,
            assetsCoinId, setAssetsCoinId,
            isModalVisible, setIsModalVisible,
            drawerBgColor, setDrawerBgColor
        }}>
            {props.children}
        </LoginContext.Provider>
    )
}
export const Consumer = LoginContext.Consumer;