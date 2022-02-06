## Guide to create Stats Definition Config
A stats-definition config is an array of valid configuration objects based on which this API will generate the statistics. Here is basic guide on how to set up your own confuguration and generate statistics based on that.

Each object has below properties -

#### `type: string` [`mandatory`]
This defines the root type of statistics to be generated e.g. average or max count or min count etc. The current version of the API supports limited strategis for statistics generation, hence the allowed values are -
`average` |
`absolute_max` |
`absolute_min` |
`absolute_total`

#### `on: string` [`mandatory`]
This defines the 'property' in the data-set on which the stats strategy should primarily run. For example - We want to get an statistics for the Posts created by users, this key should be set to the 'property' name which holds the posts in the data set. In current context the allowed values are - `message` | `message.length` (to run stats strategy on length of the message).

#### `per_filter: string` [`mandatory`]
This defines the primary denominator for the statistics. For example - Average per month (here month is the primary denominator). In current context the allowed values are - `month` | `weekNumber` | `year` | `from_id` | `type`.

#### `groupBy: string` [`optional`]
This defines the secondry denominator for the statistics to provide an additional level of filter. For example - Average per user per month (here user is the secondary denominator). In current context the allowed values are - `from` | `weekNumber` | `year` | `from_id` | `type`.

> `per_filter` and `groupBy` can not have same values.

#### `name: string` [`mandatory`]
Each stats definition should be given a human readable name to correlate the generated statistics. 

### Example stats definition config

```
{
    "pages":[1,2,3,4,5,6,7,8,9,10],
    "statsDefinition":[
    {
      "type": "average",
      "on": "message.length",
      "per_filter": "month",
      "name": "Average character length of posts per month"
    },
    {
      "type": "absolute_max",
      "on": "message.length",
      "per_filter": "month",
      "name": "Longest post by character length per month"
    },
    {
      "type": "absolute_total",
      "on": "message",
      "per_filter": "weekNumber",
      "name": "Total posts split by week number"
    },
    {
      "type": "average",
      "on": "message",
      "per_filter": "month",
      "groupBy": "from_id",
      "name": "Average posts per user per month"
    }
  ]
}
```

