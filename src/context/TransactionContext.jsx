import React,{useEffect,useState,createContext} from 'react';
import { ethers } from 'ethers';

import {contractABI,contractAddress} from '../utils/contants.js'

export const TransactionContext = createContext();

const {ethereum} = window;

const getEthereumContract = ()=>{
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress,contractABI,signer)

    return transactionContract

}

export const TransactionProvider = ({children})=>{
    const [connectedAccount,setConnectedAccount]= useState('');
    const [formData,setFormData]= useState({
        addressTo:'',
        amount:'',
        keyword:'',
        message:''
    });
    const [isLoading,setIsLoading]= useState(false)
    const [transactionCount,setTransactionCount] = useState(0)

    const handleChange = (e,name)=>{
      
        setFormData((prevState)=>({...prevState,[name]:e.target.value}))
    }

    const checkIfWalletConnected = async ()=>{
        try {
            if(!ethereum) return alert("Please install metamask");

            const accounts = await ethereum.request({method:'eth_accounts'});
    
            if(accounts.length){
                setConnectedAccount(accounts[0]);
    
                //getAllTransaction
            }else{
                console.log('No accounts found')
            }
            console.log(accounts);
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object. ')
        }
     
    }

    const connectWallet = async ()=>{
        try {
            if(!ethereum) return alert("Please install metamask");

            const accounts = await ethereum.request({method:'eth_requestAccounts'});

            setConnectedAccount(accounts[0])
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object. ')
        }
    }

    const sendTransaction = async ()=>{
        try {
            if(!ethereum) return alert("Please install metamask");
            //get the data from the form
            const {addressTo,amount,keyword,message}= formData;
            const transactionContract = getEthereumContract()
            const parsedAmount = ethers.utils.parseEther(amount)

            await ethereum.request({
                method: 'eth_sendTransaction',
                params:[{
                    from:connectedAccount,
                    to:addressTo,
                    gas:'0x5208', //21000 GWEI
                    value:parsedAmount._hex //0.0001
                }]
            });

        const transactionHash = await transactionContract.addToBlockchain(addressTo,parsedAmount,message,keyword)
        setIsLoading(true)
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        setIsLoading(false);
        console.log(`Success - ${transactionHash.hash}`);
        const transactionCount = await transactionContract.getTransactionCount();
    } catch (error) {
            console.log(error);
            throw new Error('No ethereum object. ')
        }
    }

    useEffect(()=>{
        checkIfWalletConnected()
    },[])

    return (
        <TransactionContext.Provider value={{connectWallet,connectedAccount,formData,setFormData, sendTransaction,handleChange}}>
            {children}
        </TransactionContext.Provider>
    )
}