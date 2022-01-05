import React, { Component } from 'react';
import Calendar from 'react-calendar';
import Timeline, { TimelineMarkers, TodayMarker, CustomMarker } from 'react-calendar-timeline';
import moment from 'moment';

import 'react-calendar/dist/Calendar.css';
import 'react-calendar-timeline/lib/Timeline.css';
import './BabyCalendar.css';

export class BabyCalendar extends Component {
    static displayName = Calendar.name;

    constructor(props) {
        super(props);

        this.zoomChanged = this.zoomChanged.bind(this);
        this.calendarChanged = this.calendarChanged.bind(this);
        this.timelineChanged = this.timelineChanged.bind(this);
        this.toggleSleep = this.toggleSleep.bind(this);

        this.state = {
            sleepItems: 0,
            isSleep: false,
            sleepButton: "Start Sleep",
            timeStart: 0,
            timeEnd: 0,
            value: new Date(),
            items: [
                //{
                //    id: 1,
                //    group: 1,
                //    start_time: moment(),
                //    end_time: moment().add(1, 'hour')
                //}
            ]
        };
    }

    zoomChanged(context) {
        this.setState({ timelineCenter: (context.visibleTimeStart + context.visibleTimeEnd) / 2 });
        this.setState({ timeStart: this.state.timelineCenter - 43200000, timeEnd: this.state.timelineCenter + 43200000, value: new Date(this.state.timelineCenter) });
    }

    calendarChanged(value) {
        this.setState({ timelineCenter: (value.getTime() + value.getTime() + 86400000) / 2 });
        this.setState({ timeStart: value.getTime(), timeEnd: value.getTime() + 86400000, value: new Date(value) });
    }

    timelineChanged(timeStart, timeEnd, updateCanvas) {
        this.setState({ timelineCenter: (timeStart + timeEnd) / 2 });
        this.setState({ timeStart: timeStart, timeEnd: timeEnd, value: new Date((timeStart + timeEnd) / 2) });
        updateCanvas(timeStart, timeEnd);
    }

    toggleSleep() {
        if (this.state.isSleep)
            this.stopSleep();
        else
            this.startSleep();
    }

    stopSleep() {
        this.setState({ isSleep: false, sleepButton: "Start Sleep" });
    }

    startSleep() {
        this.setState({ sleepItems: this.state.sleepItems + 1, isSleep: true, sleepButton: "Stop Sleep" });
        this.state.items.push(
            {
                id: this.state.sleepItems,
                group: 1,
                start_time: moment(),
                end_time: moment()
            }
        );
    }

    render() {

        let groups = [{ id: 1, title: 'Sleeping' }, { id: 2, title: 'Eating' }, { id: 3, title: 'Playing' }, { id: 4, title: 'Crying' }]

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
                    <button type="button" className="btn btn-primary" onClick={this.toggleSleep}>{this.state.sleepButton}</button>
                    <p>{this.state.sleepItems}</p>
                </div>
            </div>
        );
    }

}