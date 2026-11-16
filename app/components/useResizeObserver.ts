"use client"

import { useEffect, useRef } from "react"
import type { RefObject } from "react"

interface Props{
    picture: RefObject<HTMLElement|null>
}
export function useResizeObserver({ picture }: Props): RefObject<number|null>{
    
    const width = useRef<number|null>(null)
    
    useEffect(()=>{
        if(!picture.current)return
        
        const RO = new ResizeObserver((entries)=>{
            if(!entries[0])return

            const gap = (window.innerWidth*0.01)*3
            width.current = entries[0].borderBoxSize[0].inlineSize * 3 + gap
        })

        RO.observe(picture.current)

        return()=>RO.disconnect()
    },[])

    return width
}