import React, { createContext, useState } from "react";

import PropTypes from 'prop-types'

const SideBarContext = createContext();

export function SideBarProvider({ children }){
    const [sideBarOpen, setSideBarOpen] = useState(false)

    return (
        <SideBarContext.Provider
            value={{
                sideBarOpen,
                setSideBarOpen
            }}
        >
            {children}
        </SideBarContext.Provider>
    )
}

SideBarProvider.propTypes = {
    children: PropTypes.node
}

export default SideBarContext;