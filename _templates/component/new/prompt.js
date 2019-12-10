const config = require('../../config')
const projectConfig = config.getConfig()

module.exports = {
  prompt: ({ prompter, args }) => {
    return prompter
      .prompt([{
        type: 'input',
        name: 'name',
        message: 'What is you new component name?'
      }])
      .then((answers) => {
        return  {
          ...projectConfig,
          ...answers,
          path: `${projectConfig.srcDir}components/${answers.name}.vue`,
          compName: answers.name.split('/').pop()
        }
      })
  }
}
