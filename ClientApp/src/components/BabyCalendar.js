import React, { Component } from 'react';
import Calendar from 'react-calendar';
import Timeline from 'react-calendar-timeline';
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

        this.state = {
            timeStart: 0,
            timeEnd: 0,
            value: new Date(),
            items: [
                {
                    id: 1,
                    group: 1,
                    start_time: moment(),
                    end_time: moment().add(1, 'hour')
                }
            ]
        };
    }

    zoomChanged(context) {
        var a = (context.visibleTimeStart + context.visibleTimeEnd) / 2;
        this.setState({ timeStart: a - 43200000, timeEnd: a + 43200000, value: new Date(a) });
    }

    calendarChanged(value) {
        this.setState({ timeStart: value.getTime(), timeEnd: value.getTime() + 86400000, value: new Date(value) });
    }

    timelineChanged(timeStart, timeEnd, updateCanvas) {
        this.setState({ timeStart: timeStart, timeEnd: timeEnd, value: new Date((timeStart + timeEnd) / 2) });
        updateCanvas(timeStart, timeEnd);
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
                    />
                </div>
            </div>
        );
    }

}