# redis modules

### redis

#####连接池
~~~~
    func initRedis() {
        redis = new(Redis)
        redis.pool = &red.Pool{
            MaxIdle:     256,
            MaxActive:   0,
            IdleTimeout: time.Duration(120),
            Dial: func() (red.Conn, error) {
                return red.Dial(
                    "tcp",
                    "127.0.0.1:6379",
                    red.DialReadTimeout(time.Duration(1000)*time.Millisecond),
                    red.DialWriteTimeout(time.Duration(1000)*time.Millisecond),
                    red.DialConnectTimeout(time.Duration(1000)*time.Millisecond),
                    red.DialDatabase(0),
                    //red.DialPassword(""),
                )
            },
        }
    }
    
    func Exec(cmd string, key interface{}, args ...interface{}) (interface{}, error) {
        con := redis.pool.Get()
        if err := con.Err(); err != nil {
            return nil, err
        }
        defer con.Close()
        parmas := make([]interface{}, 0)
        parmas = append(parmas, key)
    
        if len(args) > 0 {
            for _, v := range args {
                parmas = append(parmas, v)
            }
        }
        return con.Do(cmd, parmas...)
    }
    
    func main() {
        initRedis()
    
        Exec("set","hello","world")
        fmt.Print(2)
        result,err := Exec("get","hello")
        if err != nil {
            fmt.Print(err.Error())
        }
        str,_:=red.String(result,err)
        fmt.Print(str)
    }
~~~~

MaxIdle：最大的空闲连接数，表示即使没有redis连接时依然可以保持N个空闲的连接，而不被清除，随时处于待命状态。

MaxActive：最大的连接数，表示同时最多有N个连接。0表示不限制。

IdleTimeout：最大的空闲连接等待时间，超过此时间后，空闲连接将被关闭。如果设置成0，空闲连接将不会被关闭。应该设置一个比redis服务端超时时间更短的时间。

DialConnectTimeout：连接Redis超时时间。

DialReadTimeout：从Redis读取数据超时时间。

DialWriteTimeout：向Redis写入数据超时时间。

