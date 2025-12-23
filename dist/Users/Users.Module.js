"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usermodule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const Users_Controller_1 = require("./Users.Controller");
const Users_Service_1 = require("./Users.Service");
const Users_s_1 = require("../schema/Users_s");
const auth_module_1 = require("../auth/auth.module");
let Usermodule = class Usermodule {
};
exports.Usermodule = Usermodule;
exports.Usermodule = Usermodule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: Users_s_1.User.name, schema: Users_s_1.UserSchema }]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [Users_Controller_1.UsersController],
        providers: [Users_Service_1.UsersService],
        exports: [Users_Service_1.UsersService],
    })
], Usermodule);
//# sourceMappingURL=Users.Module.js.map