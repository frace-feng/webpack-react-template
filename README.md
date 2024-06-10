# webpack react template

## 有什么功能

eslint
Less
css modules类型声明自动生成
husky
node版本统一
打包分析
react热更新

## webpack初始化

```
pnpm add -D webpack webpack-cli
```

## HtmlWebpackPlugin

html-webpack-plugin是一个webpack插件，它的主要功能是简化在构建过程中生成HTML文件的工作。它可以根据指定的模板文件生成一个HTML文件，并将打包后的资源文件自动注入到生成的HTML文件中。这样可以避免手动创建HTML文件，并手动引用打包后的资源文件的繁琐工作，提高开发效率。

html-webpack-plugin插件还提供了一些其他功能，例如压缩HTML代码、设置生成的HTML文件的title、favicon等属性、支持多个HTML文件的生成等。通过配置html-webpack-plugin插件，开发者可以根据自己的需求定制生成的HTML文件，实现更加灵活和高效的前端开发流程。

## 获取webpack的运行环境变量

通过cross-env
命令行： `cross-env NODE_ENV=development webpack serve --config webpack.config.js`

## eslint的工具

antfu：<https://github.com/antfu/eslint-config>

## babel

需要安装包

```
pnpm add -D @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript
```

在webpack的rule中添加

```JS
 {
    test: /\.(js|ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', { useBuiltIns: 'usage' }],
          ['@babel/preset-react', { runtime: 'automatic' }],
          ['@babel/preset-typescript'],
        ],
      },
    },
  },
```

## 打包产物为什么用hash，用哪个hash，为什么用这个hash

为什么用contenthash，不用别的hash
chunkhash：The hash of the chunk, including all elements of the chunk
contenthash：The hash of the chunk, including only elements of this content type (affected by optimization.realContentHash)
fullhash：The full hash of compilation

## 前端框架react

`pnpm add react react-dom`

## ts

`pnpm add -D typescript`
无需引入ts-loader，因为babel已经支持了ts，会处理ts文件的

### 检测ts语法错误`pnpm add -D fork-ts-checker-webpack-plugin`

因为没有引入ts-loader，所以用的是fork-ts-checker-webpack-plugin，性能会比ts-loader好一些，

### 相关工具包的ts包

@types/lodash
@types/react
@types/react-dom

### 简单了解ts-loader

ts-loader是一个用于将TypeScript代码编译为JavaScript代码的Webpack加载器。在前端项目中，TypeScript通常被用于增强JavaScript的类型检查和编译能力，使代码更加健壮和可维护。然而，现在的前端项目在使用TypeScript时更倾向于使用ts-loader的替代方案，如使用babel-loader配合@babel/preset-typescript插件来处理TypeScript代码。

### 为什么现在的前端项目不再普遍使用ts-loader

1. Babel支持：Babel是一个广泛使用的JavaScript编译工具，它支持更多的JavaScript语法特性和插件。通过使用babel-loader和@babel/preset-typescript插件，开发者可以实现对TypeScript代码的编译和转换，同时利用Babel的更丰富的生态系统。

2. 性能优化：相比于ts-loader，babel-loader在处理TypeScript代码时通常更快速和高效。这是因为Babel是一个更轻量级的工具，其编译过程更加快速。

3. 生态系统支持：Babel拥有一个庞大的生态系统，有着丰富的插件和工具支持，可以满足更多的需求。使用babel-loader可以更好地与其他Babel插件和工具集成，提供更多的功能和定制化选项。

尽管ts-loader仍然是一个可行的选择，但在现代前端项目中，使用babel-loader和@babel/preset-typescript插件来处理TypeScript代码已经成为一种更为流行的选择。这能够提供更好的性能、更丰富的功能支持，以及更好的生态系统整合。

## css-module

最新版css-loader@7x进行了代码的变更，
options里的module中的namedExport默认值是true，所以引入的时候是要按照以下规则：

```JS
import * as styles from './index.less'
```

```
modules: {
          auto: true,
        },
```

auto=true会自动处理.module.*ss的文件

## dev-server

需要安装插件webpack-dev-server
webpack.config.js

```JS
  devServer: {
    compress: true,
    port: 9000,
    hot: true,
    open: true,
  },
```

package.json
`webpack serve --config webpack.config.js`

## 初始建项目遇到了问题

### react18 “React”指 UMD 全局，但当前文件是模块。请考虑改为添加导入。ts(2686)

解决方案：

1. 每个react子组件都引入`import React from 'react';`
2. 在TypeScript配置文件（通常是tsconfig.json）中"jsx"改为 "react-jsx"。

在tsconfig.json中添加如下配置：
{
  "compilerOptions": {
    "jsx": "react-jsx",
  }
}
v17之后，React 与 Babel 官方进行合作，直接通过将`react/jsx-runtime`对 jsx 语法进行了新的转换而不依赖`React.createElement`，因此v17使用 jsx 语法可以不引入 React，应用程序依然能正常运行。

```
function App() {
  return <h1>Hello World</h1>;
}

// 新的 jsx 转换为
// 由编译器引入（禁止自己引入！）
import { jsx as _jsx } from 'react/jsx-runtime';

function App() {
  return _jsx('h1', { children: 'Hello world' });
}

```

jsx: react ， input:<div> output(.js): React.createElement("div")
jsx: react-jsx ， input:<div> output(.js): _jsx("div", {}, void 0);
