module.exports =
  SourceBuilder: require "./sourceBuilder"
  TestBuilder: require "./test/testBuilder"
  component: (n) =>
    require "./#{n}"

