import React, { Component } from 'react'
import _ from 'lodash'
import { ResizableBox } from 'react-resizable'
//
//
import { Line, Area, Bar, Bubble } from '../../../../src'

const types = {
  line: Line,
  area: Area,
  bar: Bar,
  bubble: Bubble,
}

const options = {
  elementType: Object.keys(types),
  primaryAxisType: ['linear', 'time', 'log', 'ordinal'],
  secondaryAxisType: ['linear', 'time', 'log', 'ordinal'],
  primaryAxisPosition: ['top', 'left', 'right', 'bottom'],
  secondaryAxisPosition: ['top', 'left', 'right', 'bottom'],
  secondaryAxisStack: [true, false],
  interaction: ['axis', 'series', 'closestSeries', 'closestPoint', 'element'],
  tooltipPosition: [
    'top',
    'bottom',
    'left',
    'right',
    'center',
    'gridTop',
    'gridBottom',
    'gridLeft',
    'gridRight',
    'gridCenter',
    'chartTop',
    'chartBottom',
    'chartLeft',
    'chartRight',
    'chartCenter',
    'cursor',
    'closest',
  ],
  tooltipAlign: ['top', 'bottom', 'left', 'right', 'center'],
  snapCursor: [true, false],
}

const optionKeys = Object.keys(options)

export default class ChartConfig extends Component {
  static defaultProps = {
    count: 1,
    resizable: true,
    width: 500,
    height: 300,
    canRandomize: true,
    dataType: 'time',
    show: [],
    elementType: 'line',
    primaryAxisType: 'time',
    secondaryAxisType: 'linear',
    primaryAxisPosition: 'bottom',
    secondaryAxisPosition: 'left',
    primaryAxisStack: false,
    secondaryAxisStack: true,
    interaction: 'axis',
    tooltipPosition: 'closest',
    tooltipAlign: 'top',
    snapCursor: true,
  }
  constructor (props) {
    super()
    this.state = {
      ...props,
      data: makeData(props.dataType),
    }
    console.log(this.state.data)
  }
  render () {
    const {
      render, children, show, count, resizable, width, height, canRandomize,
    } = this.props
    return (
      <div>
        {optionKeys.map(
          option =>
            show.indexOf(option) > -1 ? (
              <div key={option}>
                {option}: &nbsp;
                <select
                  value={this.state[option]}
                  onChange={({ target: { value } }) =>
                    this.setState(() => ({
                      [option]: typeof options[option][0] === 'boolean' ? value === 'true' : value,
                    }))
                  }
                >
                  {options[option].map(d => (
                    <option value={d} key={d.toString()}>
                      {d.toString()}
                    </option>
                  ))}
                </select>
                <br />
              </div>
            ) : (
              <div key={option} />
            )
        )}

        {canRandomize && (
          <div>
            <button
              onClick={() =>
                this.setState({
                  data: makeData(this.props.dataType),
                })
              }
            >
              Randomize Data
            </button>

            <br />
            <br />
          </div>
        )}

        {_.range(count).map(
          (d, i) =>
            resizable ? (
              <ResizableBox key={i} width={width} height={height}>
                {(render || children)({
                  ...this.state,
                  elementType: types[this.state.elementType],
                })}
              </ResizableBox>
            ) : (
              (render || children)({
                ...this.state,
                elementType: types[this.state.elementType],
              })
            )
        )}
      </div>
    )
  }
}

function makeData (dataType) {
  return _.map(_.range(Math.max(Math.round(Math.random() * 5), 1)), d => makeSeries(d, dataType))
}

function makeSeries (i, dataType) {
  const start = 0
  const startDate = new Date()
  startDate.setSeconds(0)
  startDate.setMilliseconds(0)
  const length = Math.round(Math.random() * 30)
  const max = 100
  return {
    label: `Series ${i + 1}`,
    data: _.map(_.range(length), d => {
      // x: d * multiplier,
      let x = start + d
      if (dataType === 'time') {
        x = new Date(startDate.getTime() + 60 * 1000 * 30 * d)
      }
      return {
        x,
        y: Math.round(Math.random() * max + Math.round(Math.random() * 50)),
        r: Math.round(Math.random() * 5),
      }
    }),
  }
}