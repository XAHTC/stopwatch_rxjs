import { interval, fromEvent } from 'rxjs';
import { debounceTime, filter, buffer, map } from 'rxjs/operators';
import { useState, useEffect, useRef, useCallback } from 'react';

import s from './styles.module.css';

const Timer = () => {
    const [time, setTime] = useState(0);
    const [isOn, setOn] = useState(false);

    const interval$ = useRef();
    const pauseButtonRef = useRef();

    const pauseTimer = useCallback(() => {
        if (isOn) {
            interval$.current.unsubscribe();
            setOn(false);
        }
    }, [isOn]);

    const resetTimer = useCallback(() => {
        setTime(0);
    }, []);

    useEffect(() => {
        const click$ = fromEvent(pauseButtonRef.current, 'click');
        const buffer$ = click$.pipe(debounceTime(300));
        click$
            .pipe(
                buffer(buffer$),
                map((a) => a.length),
                filter((i) => i === 2),
            )
            .subscribe(pauseTimer);
    }, [pauseButtonRef, pauseTimer]);

    const handleClickStart = () => {
        interval$.current = interval(1000).subscribe(() => setTime((t) => t + 1));
        setOn(true);
    };

    const handleClickStop = useCallback(() => {
        pauseTimer();
        resetTimer();
    }, [pauseTimer, resetTimer]);

    const handleClickReset = () => {
        resetTimer();
    };

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time - hours * 3600) / 60);
        const seconds = Math.floor(time % 60);

        return {
            hours: hours < 10 ? `0${hours}` : hours,
            minutes: minutes < 10 ? `0${minutes}` : minutes,
            seconds: seconds < 10 ? `0${seconds}` : seconds,
        };
    };

    return (
        <div className={s.container}>
            <div className={s.values}>
                <h2 className={s.header}>{formatTime(time).hours}</h2>:
                <h2 className={s.header}>{formatTime(time).minutes}</h2>:
                <h2 className={s.header}>{formatTime(time).seconds}</h2>
            </div>

            <div className={s.buttons}>
                <button className={s.button} onClick={isOn ? handleClickStop : handleClickStart}>
                    {isOn ? 'Stop' : 'Start'}
                </button>
                <button className={s.button} ref={pauseButtonRef}>
                    Wait
                </button>
                <button className={s.button} onClick={handleClickReset}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Timer;
