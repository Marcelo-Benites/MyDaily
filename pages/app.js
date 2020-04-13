import React, { useEffect }from 'react'
import auth0 from '../lib/auth0'
import router from  'next/router'
import { db } from '../lib/db'

const App = (props) => {
    useEffect(() => {
        if(!props.isAuth){
            router.push('/')
        }else if(props.forceCreat){
            router.push('/create-status')
        }
    })
    if(!props.isAuth || props.forceCreat){
        return null 
    }
    return(
    <div>
       <h1>App</h1>
       <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
    )
}

export default  App

export async function  getServerSideProps ({req , res}) {
    const session = await auth0.getSession(req)
    if(session){
        const today = new Date()
        const currentDate = today.getFullYear() + '-'+ today.getMonth()+'-'+ today.getDate()  
      const todaysCheckin = await db
            .collection('markers')
            .doc(currentDate) 
            .collection('checkes')
            .doc(session.user.sub)
            .get()
        const todaysData = todaysCheckin.data()
        let forceCreat  = true
        if(todaysData){
            // pode ver os outros checkins
            forceCreat = false
        }
                                  
        return  {
            props:{
                isAuth:true,
                user: session.user,
                forceCreat
            }
        }
    }
    return {
        props: {
            isAuth:false,
            user:{
            }
        }
    }
}