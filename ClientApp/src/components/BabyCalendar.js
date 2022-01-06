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
            sleepItems: -1,
            isSleep: false,
            sleepText: "Start Sleep",
            timeStart: moment().add(-12, 'h'),
            timeEnd: moment().add(12, 'h'),
            value: new Date(),
            items: []
        };
    }

    calendarChanged(value) {
        var time = value.getTime();
        this.setState({
            timelineCenter: time + HALF_DAY_MILS,
            timeStart: time,
            timeEnd: time + DAY_MILS,
            value: new Date(value)
        });
    }

    zoomChanged(context) {
        var center = (context.visibleTimeStart + context.visibleTimeEnd) / 2;
        this.setState({
            timelineCenter: center,
            timeStart: center - HALF_DAY_MILS,
            timeEnd: center + HALF_DAY_MILS,
            value: new Date(center)
        });
    }

    timelineChanged(timeStart, timeEnd, updateCanvas) {
        var center = (timeStart + timeEnd) / 2;
        this.setState({
            timelineCenter: center,
            timeStart: timeStart,
            timeEnd: timeEnd,
            value: new Date(center)
        });
        updateCanvas(timeStart, timeEnd);
    }

    toggleSleep() {
        if (this.state.isSleep)
            this.stopSleep();
        else
            this.startSleep();
    }

    stopSleep() {
        this.setState({ isSleep: false, sleepText: "Start Sleep" });
        this.state.items[this.state.sleepItems].end_time = (this.state.timeStart + this.state.timeEnd) / 2;
    }

    startSleep() {
        this.setState({ sleepItems: this.state.sleepItems + 1, isSleep: true, sleepText: "Stop Sleep" });
        this.state.items.push(
            {
                id: this.state.sleepItems,
                group: 1,
                start_time: (this.state.timeStart + this.state.timeEnd) / 2,
                end_time: moment()
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
                        minZoom={86400000}
                        maxZoom={86400000}
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
                    <button type="button" className="btn btn-primary" onClick={this.toggleSleep}>...at Cursor {moment(this.state.timelineCenter).format('h:mm')}</button>
                    <p>{this.state.sleepItems}</p>
                </div>
            </div>
        );
    }

}