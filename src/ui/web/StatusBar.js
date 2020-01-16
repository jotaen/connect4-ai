const React = require("react")

module.exports = function StatusBar({ user, opponent, isUserNext }) {
  return (
    <div>
      <div
        style={{ textDecoration: isUserNext ? "underline" : "none" }}
      >
        {user.name}
      </div>
      <div
        style={{ textDecoration: !isUserNext ? "underline" : "none" }}
      >
        {opponent.name}
      </div>
    </div>
  )
}
