



const { request } = require("express");
const { Order, ErrorLog } = require("~database/models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");


class OrderController{

/* ------------------------ GET ALL ORDER END POINT ------------------------ */
            static async getallOrders(req, res){
                try{

                var allorders = await Order.findAll();
                if(allorders){
                    return res.status(200).json({
                        error : false,
                        message: "All Orders fetched successfully",
                        data : allorders
                    });

                }else{
                    return res.status(200).json({
                        error : true,
                        message: "Failed to fetched orders",
                    });

                }

            }catch(e){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all orders",
                    error_description: e.toString(),
                    route: "/api/admin/order/getall",
                    error_code: "500"
                });
                if(logError){
                    return res.status(500).json({
                        error: true,
                        message: 'Unable to complete request at the moment',
                    })
                }
            }
            }

      /* --------------------------- GET ORDER BY PARAMS -------------------------- */
      static async getordersbyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
        var ordersparams = await Order.findAll({
            limit:limit,
            offset:offset
        });
        if(ordersparams){
            return res.status(200).json({
                error: false,
                message: 'orders Fetched successfully',
                data: ordersparams
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to fetch orders',
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting all orders by paprams",
            error_description: e.toString(),
            route: "/api/admin/order/getallparams/:offset/:limit",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment',
                
            })

        }
    }

    }

    /* --------------------- GET ORDER USER ID ENDPOINT --------------------- */
    static async getorderbyorderid(req,res){
        try{
            
        var orderid = await Order.findOne({where: {order_id:req.params.order_id}});

        if(orderid){
            return res.status(200).json({
                error: false,
                message: 'Order fetched successfully',
                data: orderid
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to fetch order',
                
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting order by id",
            error_description: e.toString(),
            route: "/api/admin/order/getbyorderid/:order_id",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment',
            })

        }
    }
    }

    /* --------------------- GET ORDER by ORDER ID ENDPOINT --------------------- */
    static async getorderbyid(req,res){
        try{


        var theorderid = await Order.findOne({where: {id:req.params.id}});

        if(theorderid){
            return res.status(200).json({
                error:false,
                message: 'Order fetched successfully',
                data: theorderid
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to fetch order',
               
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting order by id",
            error_description: e.toString(),
            route: "/api/admin/order/getbyid/:id",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment',
            })

        }
    }
    }
   
}

module.exports = OrderController;

    