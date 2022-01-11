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
        this.initState();
    }

    bindFunctions() {
        this.zoomChanged = this.zoomChanged.bind(this);
        this.calendarChanged = this.calendarChanged.bind(this);
        this.timelineChanged = this.timelineChanged.bind(this);
        this.toggleSleep = this.toggleSleep.bind(this);
    }

    initState() {
        this.state = {
            sleepItems: 0,
            isSleep: false,
            sleepText: "Start Sleep",
            canStopSleep: true,
            timeStart: moment().add(-12, 'h'),
            timeEnd: moment().add(12, 'h'),
            value: new Date(),
            items: []
        };
    }

    calendarChanged(value) {
        var time = value.getTime();
        var center = time + HALF_DAY_MILS;
        this.setState({
            timelineCenter: center,
            timeStart: time,
            timeEnd: time + DAY_MILS,
            value: new Date(value)
        });
        if (this.state.isSleep)
            this.setState({ canStopSleep: this.canStopSleep() });
    }

    zoomChanged(context) {
        var center = (context.visibleTimeStart + context.visibleTimeEnd) / 2;
        this.setState({
            timelineCenter: center,
            timeStart: center - HALF_DAY_MILS,
            timeEnd: center + HALF_DAY_MILS,
            value: new Date(center)
        });
        if (this.state.isSleep)
            this.setState({ canStopSleep: this.canStopSleep(center) });
    }

    timelineChanged(timeStart, timeEnd, updateCanvas) {
        var center = (timeStart + timeEnd) / 2;
        this.setState({
            timelineCenter: center,
            timeStart: timeStart,
            timeEnd: timeEnd,
            value: new Date(center)
        });
        if (this.state.isSleep)
            this.setState({ canStopSleep: this.canStopSleep(center) });
        updateCanvas(timeStart, timeEnd);
    }

    canStopSleep(center) {
        if (this.state.items.some((item, i) => {
            console.log(item.id != this.state.sleepItems);
            if (item.id != this.state.sleepItems && item.start_time < center && item.end_time > center)
                return true;
        }))
            return false;
        return this.state.items[this.state.sleepItems].start_time < center;
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
                    <button disabled={!this.state.canStopSleep} type="button" className="btn btn-primary" onClick={this.toggleSleep}>...at Cursor {moment(this.state.timelineCenter).format('h:mm')}</button>
                </div>
            </div>
        );
    }

}