import { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext<appContext>({
    data: [],
    enableBin: () => { },
    refreshData: () => { },
    deleteBin: () => { },
    editBin: () => { },
    addBin: () => { },
});

type appContext = {
    data: Bin[]
    enableBin: Function
    refreshData: Function
    deleteBin: Function
    editBin: Function
    addBin: Function
}
type Bin = {
    id: string;
    level: string;
    enabled: boolean;
}

export type { Bin };

export const AppData = () => {
    return useContext(AppContext);
}

const URL = "https://app-p5uzyn3l6q-uc.a.run.app/"



export const ContextProvider = ({ children }: any) => {

    const [data, setData] = useState<Bin[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [refresh, setRefresh] = useState<boolean>(true)

    const refreshData = () => setRefresh(prev => !prev)

    const addBin = (bin: Bin): Promise<Response> => {
        return fetch(URL, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(bin)
        });
    }

    const enableBin = (bin: Bin): Promise<Response> => {
        return fetch(URL, {
            method: "PATCH",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(bin)
        });
    }

    const editBin = (bin: Bin, id: string, level: string): Promise<Response> => {
        const newObj = {
            ...bin,
            newId: id
        }
        return fetch(URL, {
            method: "PUT",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(newObj)
        });
    }

    const deleteBin = (id: string): Promise<Response> => {
        return fetch(URL, {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ id: id })
        });
    }

    useEffect(() => {
        fetch(URL, {
            method: "Get",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setData(data)
            setLoading(false)
        }).catch((error) => {
            console.log(error);
        });

    }, [refresh])
    const values = {
        data,
        enableBin,
        refreshData,
        deleteBin,
        editBin,
        addBin
    }
    return (
        <AppContext.Provider value={values}>
            {!loading && children}
        </AppContext.Provider>
    )
}