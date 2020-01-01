module.exports.generateMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime()
  }
}

module.exports.generateLocation = (pos) => {
  return {
    pos,
    createdAt: new Date().getTime()
  }
}