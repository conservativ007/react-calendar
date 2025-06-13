module.exports = {
  apps : [{
    name: 'reminders',
    script: 'npx',
    args: 'serve -s build -l 4001 -n 127.0.0.1',
    interpreter: 'bash'
  }]
};