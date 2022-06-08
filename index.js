#!/usr/bin/env node

const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const program = require('caporal')
const curr = process.cwd();
const fs = require('fs')
const {spawn} = require('child_process');
const chalk = require('chalk')


program
    .version('1.0.0')
    .argument('[filename]', 'Name of a file to execute')
    .action( async ({filename}) =>{
        const name = filename||'index.js';
        try{
        await fs.promises.access(name)
        }catch(err){
            throw new Error('Could not find the file')
        }
        
        let proc;
        const start = debounce(()=>{
            if(proc){
                proc.kill();
            }
            console.log(chalk.greenBright('>>>>Starting Process...!'));
            proc = spawn('node', [name], {stdio:'inherit'});
        },500)

        chokidar.watch(curr)
            .on('add', start)
            .on('change',start)
            .on('unlink',start)

        
    });

program.parse(process.argv)

