package main

const (
	USERNAME   = "root"
	PASSWORD   = "lcy###111"
	NETWORK    = "tcp"
	SERVER     = "127.0.0.1"
	PORT       = 3306
	DATABASE   = "test"
	LogPath    = "log"
	RedisIp    = "127.0.0.1"
	RedisPort  = 6379
	ExpireTime = 3600
)

type ServerConfig struct {
	Host       string
	Port       int
	PASSWORD   string
	NETWORK    string
	SERVER     string
	DATABASE   string
	RedisIp    string
	RedisPort  int
	ExpireTime int
	LogPath    string
}


// ParseConfig("dtspServer.ini")
//func (s *Container) ParseConfig(file string) {
//	cfg, err := ini.Load(file)
//	if err != nil {
//		fmt.Printf("Fail to read file: %v", err)
//		os.Exit(1)
//	}
//	pwd, _ := os.Getwd()
//
//	s.Config.Port = cfg.Section("dtsp_go").Key("http_port").MustInt(10500)
//	s.Config.RedisIp = cfg.Section("config").Key("RedisIp").MustString("127.0.0.1")
//	s.Config.RedisPort = cfg.Section("config").Key("RedisPort").MustInt(6379)
//	s.Config.ExpireTime = cfg.Section("config").Key("ExpireTime").MustInt(3600)
//	s.Config.LogPath = cfg.Section("config").Key("LOGPATH").MustString(pwd)
//	s.Config.DatabaseUrl = cfg.Section("config").Key("DatabaseIP").MustString("127.0.0.1")
//}

