### AuthNetModule

**应** 仅只留 `providers` 属性。

**作用：**  一些通用服务，例如：用户消息、HTTP数据访问。

* If you are following the style guide, there will be AuthNetModule and SharedModule confusion.

* AuthNetModule is for things that are "providable". (Mainly services) It should be imported only once at the root AppModule.

* SharedModule are for things that are "declarable". (Components, pipes, directives) It can be import many times.
