/* ------------------------------ Dependencies ------------------------------ */
import { resolve } from 'node:path'
import _ from 'lodash'
import config from 'config'
/* ----------------------------- Custom Modules ----------------------------- */
import { grpc, grpcServer, loaderOptions, protoLoader } from '../../../../constants/grpc.config'
import authService from '../../../../../../modules/auth/auth.service'
import { IApplicationConfig } from '../../../../../../../config/config.interface'
import tokenHelper from '../../../../../../common/helpers/token.helper'
/* -------------------------------------------------------------------------- */

/* -------------------------------- Constants ------------------------------- */
const PROTO_PATH = resolve(
    process.cwd(),
    'src/applications/gRPC/servers/default/modules/auth/auth.proto'
)
const packageDef = protoLoader.loadSync(PROTO_PATH, loaderOptions)
const grpcObj = grpc.loadPackageDefinition(packageDef)
/* -------------------------------------------------------------------------- */

const applicationConfig: IApplicationConfig = config.get('application')

/* SECTION -------------------- Register Services --------------------------- */
grpcServer.addService(grpcObj.authentication.Auth.service, {
    /* -------------------------------------------------------------------------- */
    /*                                 Login Admin                                */
    /* -------------------------------------------------------------------------- */
    loginAdmin: async (args, callback) => {
        const { email, password } = args.request

        if (!email || !password)
            return callback({
                status: grpc.status.INVALID_ARGUMENT,
                message: 'Invalid arguments.'
            })
        else {
            try {
                const { admin, token } = await authService.loginAdmin({ email, password })
                return callback(null, { status: grpc.status.OK, token, admin })
            } catch (error) {
                return callback(error)
            }
        }
    },

    /* -------------------------------------------------------------------------- */
    /*                                 Login User                                 */
    /* -------------------------------------------------------------------------- */
    loginUser: async (args, callback) => {
        const { email, password } = args.request

        if (!email || !password)
            return callback({
                status: grpc.status.INVALID_ARGUMENT,
                message: 'Invalid arguments.'
            })
        else {
            try {
                const { user, token } = await authService.loginUser({ email, password })
                return callback(null, { status: grpc.status.OK, token, user })
            } catch (error) {
                return callback(error)
            }
        }
    },

    /* -------------------------------------------------------------------------- */
    /*                               Register Admin                               */
    /* -------------------------------------------------------------------------- */
    registerAdmin: async (args, callback) => {
        const { email, password, authorization } = args.request

        if (!email || !password || !authorization)
            return callback({
                status: grpc.status.INVALID_ARGUMENT,
                message: 'Invalid arguments.'
            })
        else {
            try {
                const extractedToken = authorization.slice(applicationConfig.bearer.length + 1)
                const { valid, data } = tokenHelper.verify(extractedToken)
                if (!valid)
                    return callback({
                        status: grpc.status.INVALID_ARGUMENT,
                        message: 'Authorization argument is not valid.'
                    })
                const { admin, token } = await authService.registerAdmin(data, { email, password })
                return callback(null, { status: grpc.status.OK, token, admin })
            } catch (error) {
                return callback(error)
            }
        }
    },

    /* -------------------------------------------------------------------------- */
    /*                                Register User                               */
    /* -------------------------------------------------------------------------- */
    registerUser: async (args, callback) => {
        const { email, password } = args.request

        if (!email || !password)
            return callback({
                status: grpc.status.INVALID_ARGUMENT,
                message: 'Invalid arguments.'
            })
        else {
            try {
                const { user, token } = await authService.registerUser({ email, password })
                return callback(null, { status: grpc.status.OK, token, user })
            } catch (error) {
                return callback(error)
            }
        }
    }
})
/* -------------------------------------------------------------------------- */
