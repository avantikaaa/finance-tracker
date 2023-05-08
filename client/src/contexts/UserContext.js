import { createContext, useState } from "react";

export const UserContext = createContext({userInfo:{}, setUserInfo : ()=>{},});

export function UserContextProvider({children}){
    const [userInfo, setUserInfo] = useState();

    return (
       < UserContext.Provider value = {{userInfo, setUserInfo}}>
       {children}
       </UserContext.Provider>
    );
}
// import { createContext, Dispatch, SetStateAction } from "react";
// interface IUserContext{
//     setUsername:Dispatch<SetStateAction<string>>;
//     username:string;
// }
// export const UserContext = createContext<IUserContext>({} as IUserContext);