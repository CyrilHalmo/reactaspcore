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
        this.timelineChanged = this.timelineChanged.bind(this);
        this.state = {
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

    timelineChanged(timeStart, timeEnd, updateCanvas) {
        updateCanvas(timeStart, timeEnd);
        this.setState({ value: new Date((timeStart + timeEnd) / 2) });
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
                    />
                </div>
            </div>
        );
    }

}