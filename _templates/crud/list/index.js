const config = require('../../config');

const questions = [
  {
    type: 'input',
    name: 'endpoint',
    message: 'What is your api endpoint ?'
  },
  {
    type: 'input',
    name: 'resource',
    message: 'What is you new list resource name?'
  },
  {
    type: 'confirm',
    name: 'showFilters',
    message: 'Do you want to show filters?'
  },
];

module.exports = {
  prompt: ({ prompter, args }) => {
    const providedArgs = questions.reduce((selectedArgs, question) => {
      if (args[question.name]) selectedArgs[question.name] = args[question.name];
      return selectedArgs;
    }, {});
    return prompter
      .prompt(questions.filter(({ name }) => !providedArgs[name]))
      .then(answers => {
        let configuration = { ...answers, ...providedArgs };
        return config.getResourceConfiguration(configuration.endpoint, configuration.resource).then(resources => Object.assign(configuration, { resourceConfiguration: resources[0] }))
      }).then(configuration => configuration);
  }
};
