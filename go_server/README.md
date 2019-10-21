# server modules

### mysql

#####结构
~~~~
    type Mysql struct {
    	USERNAME string
    	PASSWORD string
    	NETWORK string
    	SERVER string
    	PORT int
    	DATABASE string
    	DB *sql.DB
    	mlog *log.Logger // 日志依赖
    }
~~~~

#####实现Mysql接口
~~~~
    type Mysql interface {
    	Connect()
    	QueryOne()
    	QueryMulti()
    	InsertData()
    	UpdateData()
    	DeleteData()
    }
~~~~


### service

####路由和中间件
~~~~
    type ConfigSetting struct {
        mysql Mysql
        mlog *log.Logger
    }

    func NewRouter(mysql Mysql, mlog *log.Logger) *mux.Router {
        configSetting = ConfigSetting {
            mysql,
            mlog,
        }
    	router := mux.NewRouter().StrictSlash(true)
    	...
    	return router
    }
~~~~

####MiddleHandler中间件
~~~~
    func MiddleHandler(inner http.Handler) http.Handler {
        ... // 权限认证等
    }
~~~~

####Logger中间件
~~~~
    func Logger(inner http.Handler, name string) http.Handler {
    	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    		start := time.Now()
    		inner.ServeHTTP(w, r)
    		mlog.Printf("%s %s %s %s", r.Method, r.RequestURI, name, time.Since(start),	)
    		log.Printf("%s %s %s %s", r.Method, r.RequestURI, name, time.Since(start),)
    	})
    }
~~~~

