"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const create_client_1 = require("../client/create.client");
const logger_utils_1 = require("../utils/logger.utils");
const authenticate = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, create_client_1.createApiRoot)()
        .login()
        .post({
        body: {
            email: username,
            password: password,
        },
    })
        .execute()
        .then((response) => {
        return !!response.body.customer;
    })
        .catch((e) => {
        logger_utils_1.logger.error(e);
        return false;
    });
});
exports.authenticate = authenticate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvQ1QvYXV0aC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwyREFBd0Q7QUFDeEQsd0RBQStDO0FBRXhDLE1BQU0sWUFBWSxHQUFHLENBQU8sUUFBZ0IsRUFBRSxRQUFnQixFQUFFLEVBQUU7SUFDdkUsT0FBTyxJQUFBLDZCQUFhLEdBQUU7U0FDbkIsS0FBSyxFQUFFO1NBQ1AsSUFBSSxDQUFDO1FBQ0osSUFBSSxFQUFFO1lBQ0osS0FBSyxFQUFFLFFBQVE7WUFDZixRQUFRLEVBQUUsUUFBUTtTQUNuQjtLQUNGLENBQUM7U0FDRCxPQUFPLEVBQUU7U0FDVCxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtRQUNqQixPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUNsQyxDQUFDLENBQUM7U0FDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUNYLHFCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUEsQ0FBQztBQWpCVyxRQUFBLFlBQVksZ0JBaUJ2QiJ9