import React, { Component } from 'react';
import Calendar from 'react-calendar';
import Timeline, { TimelineMarkers, TodayMarker, CustomMarker } from 'react-calendar-timeline';
import moment from 'moment';

import 'react-calendar/dist/Calendar.css';
import 'react-calendar-timeline/lib/Timeline.css';
import './BabyCalendar.css';

const DAY_MILS = 86400000;
const HALF_DAY_MILS = DAY_MILS / 2;

export class BabyCalendar extends Component {
    static displayName = Calendar.name;

    constructor(props) {
        super(props);
        this.bindFunctions();
        this.initializeState();
    }

    bindFunctions() {
        this.zoomChanged = this.zoomChanged.bind(this);
        this.calendarChanged = this.calendarChanged.bind(this);
        this.timelineChanged = this.timelineChanged.bind(this);
        this.toggleSleep = this.toggleSleep.bind(this);
    }

    initializeState() {
        this.state = {
            sleepItems: 0,
            isSleep: false,
            sleepText: "Start Sleep",
            canStopSleep: true,
            canStartSleep: true,
            timeStart: moment().add(-12, 'h'),
            timeEnd: moment().add(12, 'h'),
            value: new Date(),
            items: []
        };
    }

    calendarChanged(value) {
        this.updateState(value.getTime() + HALF_DAY_MILS);
    }

    zoomChanged(context) {
        this.updateState((context.visibleTimeStart + context.visibleTimeEnd) / 2);
    }

    timelineChanged(timeStart, timeEnd, updateCanvas) {
        this.updateState((timeStart + timeEnd) / 2);
        updateCanvas(timeStart, timeEnd);
    }

    updateState(center) {
        let timeStart = center - HALF_DAY_MILS;
        let timeEnd = center + HALF_DAY_MILS;
        this.setState({
            timelineCenter: center,
            timeStart: timeStart,
            timeEnd: timeEnd,
            value: new Date(center)
        });
        if (this.state.isSleep)
            this.setState({ canStopSleep: this.canStopSleep(center) });
        else
            this.setState({ canStartSleep: this.canStartSleep(center) });
    }

    canStartSleep(center) {
        return !this.state.items.some(item => {
            return item.start_time < center && item.end_time > center;
        });
    }

    canStopSleep(center) {
        return !this.state.items.some(item => {
            if (item.id != this.state.sleepItems) {
                if (item.start_time > this.state.items[this.state.sleepItems].start_time && item.start_time < center)
                    return true;
            }
            else if (item.start_time > center) {
                return true;
            }
            return false;
        });
    }

    toggleSleep() {
        if (this.state.isSleep)
            this.stopSleep();
        else
            this.startSleep();
    }

    stopSleep() {
        this.setState({ isSleep: false, sleepText: "Start Sleep", sleepItems: this.state.sleepItems + 1 });
        this.state.items[this.state.sleepItems].end_time = (this.state.timeStart + this.state.timeEnd) / 2;
    }

    startSleep() {
        let startTime = (this.state.timeStart + this.state.timeEnd) / 2;
        this.setState({ isSleep: true, sleepText: "Stop Sleep" });
        this.state.items.push(
            {
                id: this.state.sleepItems,
                group: 1,
                start_time: startTime,
                end_time: startTime
            }
        );
    }

    render() {

        let groups = [
            { id: 1, title: 'Sleeping' },
            { id: 2, title: 'Eating' },
            { id: 3, title: 'Playing' },
            { id: 4, title: 'Crying' }
        ]

        return (
            <div>
                <h1>Baby Calendar</h1>
                <div>
                    <Calendar
                        className="baby-calendar"
                        value={this.state.value}
                        onClickDay={this.calendarChanged}
                    />
                </div>
                <br />
                <div>
                    <Timeline
                        groups={groups}
                        items={this.state.items}
                        defaultTimeStart={moment().add(-12, 'hour')}
                        defaultTimeEnd={moment().add(12, 'hour')}
                        canMove={false}
                        canChangeGroup={false}
                        canResize={false}
                        onTimeChange={this.timelineChanged}
                        visibleTimeStart={this.state.timeStart}
                        visibleTimeEnd={this.state.timeEnd}
                        onZoom={this.zoomChanged}
                    >
                        <TimelineMarkers>
                            <TodayMarker />
                            <CustomMarker date={this.state.timelineCenter} />
                        </TimelineMarkers>
                    </Timeline>
                </div>
                <br />
                <div>
                    <p>{this.state.sleepText}...</p>
                    <button disabled={(this.state.isSleep && !this.state.canStopSleep) || (!this.state.isSleep && !this.state.canStartSleep)} type="button" className="btn btn-primary" onClick={this.toggleSleep}>...at Cursor {moment(this.state.timelineCenter).format('h:mm')}</button>
                </div>
            </div>
        );
    }

}