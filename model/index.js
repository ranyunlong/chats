var mysql = require('mysql');
var config = require('./config')
var Eventter = require('events');
class model {
    /**
     * 构造方法
     * @param {String} dbname 
     */
    constructor(tablename) {
        if (typeof tablename != undefined && tablename.length > 0) {
            //引入mysql
            this.dbConnection = mysql.createConnection(config);
            //引入events 模块
            this.Events = new Eventter();
            //表名称
            this._tablename = tablename;
            //限制查询列
            this._fileds = {
                isfiled: false, //是否限制
                fileds: '' //限制内容
            };
            //查询条件
            this._where = {
                iswhere: false,
                where: ''
            };
            this._order = {
                isorder: false,
                order: ''
            };
            //创建数据库连接
            this.createConnect();
            //注册异常处理
            this.listenError();
        } else {
            return;
        }
    };
    /**
     * 创建数据库连接方法
     */
    createConnect() {
        //建立连接
        this.dbConnection.connect();
    };
    /**
     * 查询限制
     * @param {Array} files 
     */
    filed(fileds) {
        //判断是否有参数
        if (fileds != undefined && typeof fileds == 'string') {
            this._fileds.fileds = fileds; //连接fileds字符串
            this._fileds.isfiled = true; //添加限制查询状态
        }
        this.Events.emit('DB_ERROR', new Error('ERROR fileds is undefined'));
        return this; //返回当前类对象
    };

    /**
     * 排序方法
     * @param {String} key 
     * @param {String} order 
     */
    order(key, order) {
        if (typeof key == 'string' && typeof order == 'string' && key != undefined && order != undefined) {
            this._order.isorder = true;
            // for (var i = 0; i < arr.length; i++) {
            //     arr[i] = arr[i].replace(/\s/g, ''); //清空对于的空格
            //     arr[i] = arr[i].replace(/\,/g, ' '); //拆分字符串以空格隔开
            // }
            // arr = arr.join(' '); //拆分数组以空格隔开
            this._order.order = 'ORDER BY ' + key + ' ' + order;
        }
        return this;
    }

    /**
     * 查询条件
     * @param {String} key 
     * @param {String} operator 
     * @param {String} value 
     */
    where(where) {
        if (typeof where == 'string' && where != undefined) {
            this._where = {
                iswhere: true,
                where: 'WHERE ' + where
            }
        } else {
            this.Events.emit('DB_ERROR', new Error('where is not String or where is undefined'));
        }
        return this;
    }

    /**
     * 查询方法
     * @param {function()} callback 
     */
    select(callback) {
        var dbConnect = this.dbConnection; //mysql对象
        //组合查询表达式
        var expression = this.createQueryExpression();
        //输出当前查询表达式
        dbConnect.query(expression, function(err, results, fields) {
            //if (err) this.Events.emit('DB_ERROR', new Error(err));
            if (err) console.log(err);
            callback(err, results, fields);
        });
        dbConnect.end();
    };

    insert(data, callback) {
        var keys = [];
        var datas = [];
        for (var key in data) {
            keys.push(key);
            datas.push(data[key])
        }
        return [a, b, c];

    }

    /**
     * 查询创建表达式
     */
    createQueryExpression() {
        var expression = '';
        if (this._fileds.isfiled) { //检测是否有限制
            expression = 'SELECT ' + this._fileds.fileds + ' FROM ' + this._tablename;
        } else {
            expression = 'SELECT * FROM ' + this._tablename;
        }

        if (this._where.iswhere) { //检测是否有查询条件
            expression = expression + ' ' + this._where.where;
        }
        if (this._order.isorder) {
            expression = expression + ' ' + this._order.order;
        }
        return expression;
    };

    //断开数据连接方法
    end() {
        this.dbConnection.end();
    };
    /**
     * 异常处理
     */
    listenError() {
        this.Events.on('DB_ERROR', (err) => { //添加异常事件监听
            if (config.debug) {
                console.log(err);
            }
        });
    };

}

module.exports = model;