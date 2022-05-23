export class Authorization {

  public static Permission(data: string, type: number, root: string, item: string): any[] {
    try {    
      var obj = JSON.parse(data);

      if (type == 0) {
        if (obj != null) {
          var objData = JSON.parse(obj.data);
          
          if (objData != null) {
            var objPrincipal = objData.filter(m => m.name == root);
    
            if (objPrincipal.length > 0)
              return objPrincipal[0].permissions;
          }
        }
      }

      if (type == 1) {
        if (obj != null) {
          var objData = JSON.parse(obj.data);
          
          if (objData != null) {
            var objPrincipal = objData.filter(m => m.name == root);
    
            if (objPrincipal.length > 0) {
              var objItem = objPrincipal[0].subitems.filter(m => m.name == item);
    
              if (objItem.length > 0)
                return objItem[0].permissions;
            }
          }
        }
      }
    }
    catch (e) {

    }

    return [
      { "action": "list", "status": false },
      { "action": "view", "status": false },
      { "action": "update", "status": false },
      { "action": "status", "status": false },
      { "action": "create", "status": false },
      { "action": "delete", "status": false }
    ];
  }

  public static Action(id: number, data: any[]): boolean {
    let auth = [];
    
    if (id == 0)
      auth = data.filter(m => m.action == "create");
  
    if (id == 1)
      auth = data.filter(m => m.action == "view");
  
    if (id == 2)
      auth = data.filter(m => m.action == "update");
  
    if (id == 3)
      auth = data.filter(m => m.action == "status");
  
    if (id == 4)
      auth = data.filter(m => m.action == "delete");
  
    if (auth.length > 0)
      return auth[0].status;
  
    return false;
  }

}
