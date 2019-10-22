package main

import (
	"fmt"
	"log"
	"os"
	"time"
)

func InitLog() *log.Logger {
	CreateLogPath(LogPath)
	filename := time.Now().Format("2006-01-02")
	file := LogPath + "/" + filename + ".txt"
	logFile, err := os.OpenFile(file, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0766)
	if err != nil {
		panic(err)
	}
	mlog := log.New(logFile, "[go_server]",log.LstdFlags | log.Lshortfile | log.LUTC) // 将文件设置为loger作为输出
	return mlog
}

func CreateLogPath(_dir string)  {
	exist, err := PathExists(_dir)
	if err != nil {
		fmt.Printf("get dir error! [%v]\n", err)
		return
	}
	if exist {
		fmt.Printf("has dir! [%v]\n", _dir)
	} else {
		fmt.Printf("no dir! [%v]\n", _dir)
		// 创建文件夹
		err := os.Mkdir(_dir, os.ModePerm)
		if err != nil {
			fmt.Printf("mkdir failed! [%v]\n", err)
		} else {
			fmt.Printf("mkdir success!\n")
		}
	}
}

// 判断文件夹是否存在
func PathExists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}

