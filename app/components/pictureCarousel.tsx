"use client"

import { useEffect, useRef } from "react"
import styles from "./carouselStyles.module.css";

import { useResizeObserver } from "./useResizeObserver";

export function PictureCarousel(){
    
    const rafId = useRef<number|null>(null)
    const container = useRef<HTMLDivElement|null>(null)
    const picturesWrapper = useRef<HTMLDivElement|null>(null)
    const picture = useRef<HTMLDivElement|null>(null)

    const width = useResizeObserver({picture})

    const drag = useRef(false)
    const dx = useRef(0)
    
    useEffect(()=>{
        
        if(!container.current)return
        
        const AC = new AbortController()
        const signal = AC.signal
        
        let lastX = 0

        const handleDown=(e:PointerEvent)=>{
            container.current?.setPointerCapture(e.pointerId)
            drag.current = true
            
            lastX = e.clientX
        }
        const handleMove=(e:PointerEvent)=>{
            if(!drag.current)return
            dx.current += e.clientX - lastX
            lastX = e.clientX
        }
        const handleUp=(e:PointerEvent)=>{
            if(container.current?.hasPointerCapture(e.pointerId)){
                container.current.releasePointerCapture(e.pointerId)
            }
            drag.current = false
        }
        
        container.current.addEventListener('pointerdown', handleDown, {signal})
        container.current.addEventListener('pointermove', handleMove, {signal})
        container.current.addEventListener('pointerup', handleUp, {signal})
        container.current.addEventListener('pointercancel', handleUp, {signal})
        
        return()=>AC.abort()
    },[])

    useEffect(()=>{
        if(!container.current || !picturesWrapper.current)return
        
        let input = 0
        let x = 0
        
        let before:null|number = null

        const step =(now:number)=>{
            
            if(before === null){
                before = now
            }
            const dt = (now - before) / 1000
            before = now

            const factorA = 1 - Math.exp(-5.0*dt)
            const factorB = Math.exp(-2.0*dt)

            //lerp
            drag.current ?
                input += (dx.current - input)*factorA :
                input*= factorB
            
            dx.current = 0

            x-= input
            const w = width.current??0
            const translateX = -((x % w) + w) % w // 0 bis -width
            picturesWrapper.current!.style.transform = `translateX(${translateX}px)`

            rafId.current = requestAnimationFrame(step)
        }
        rafId.current = requestAnimationFrame(step)
        
        return()=>{
            if(rafId.current !==null){
                cancelAnimationFrame(rafId.current)
            }
        }
    },[])
    
    return(
        <div 
        ref={container}
        className={styles.container}
        >
            <div 
            ref={picturesWrapper}
            className={styles.picturesWrapper}>
                {
                    Array.from({length:3}).map((_,i)=>(
                        <div 
                        key={`a-${i}`}
                        className={styles.picture}
                        ref={i===0?picture:null}
                        >a-{i}</div>
                    ))
                }
                {
                    Array.from({length:3}).map((_,i)=>(
                        <div 
                        key={`b-${i}`}
                        className={styles.picture}
                        >b-{i}</div>
                    ))
                }
            </div>
        </div>
    )
} 