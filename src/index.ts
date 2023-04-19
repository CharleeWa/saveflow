/* eslint-disable no-console */

import * as readline from 'node:readline'
import chalk from 'chalk'
import inquirer from 'inquirer'

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

interface Todo {
  name: string
  checked: boolean
}

const todos: Todo[] = []

/**
 * 递归函数，向用户询问待办事项
 */
function askQuestion(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    readlineInterface.question('请输入需要解压的事项（按e退出）：', (answer: string) => {
      if (answer === 'e') {
        resolve()
      }
      else {
        if (answer) {
          todos.push({
            name: answer,
            checked: false,
          })
        }
        askQuestion().then(resolve).catch(reject)
      }
    })
  })
}

/**
 * 打印待办事项列表
 */
function printList(): void {
  console.log(chalk.green('您需要解压的事项：'))
  todos.forEach((item, index) => {
    console.log(`${index + 1}. ${item.name} ${item.checked ? chalk.green('✓') : ''}`)
  })
}

/**
 * 让用户选择要完成的事项
 */
async function selectItem(): Promise<void> {
  const choices = todos.map(item => ({
    name: item.name,
    checked: item.checked,
  }))
  const answers = await inquirer.prompt<{ selectedItems: string[] }>({
    name: 'selectedItems',
    type: 'checkbox',
    message: '请选择要完成的事项（空格选中，回车结束）：',
    suffix: '',
    prefix: '',
    choices,
  })
  todos.forEach((item_1) => {
    item_1.checked = answers.selectedItems.includes(item_1.name)
  })
}

/**
 * 主函数，循环运行直到所有事项都被完成
 */
export async function run(): Promise<void> {
  await askQuestion()
  while (!todos.every(item => item.checked)) {
    await selectItem()
    printList()
  }
  console.log(chalk.green('🎉🎉🎉 所有事项已完成！'))
  readlineInterface.close()
}
