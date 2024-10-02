import { useState } from "react";
import { Button, Collapse } from "reactstrap";
import { ALGORITHMS } from "../../constants";
import collapseIcon from '../../images/collapse.png';
import expandIcon from '../../images/expand.png';
import Canvas from "../common-components/Canvas";
import CodeEditor from "../common-components/CodeEditor";
import useAlgos from "../hooks/useAlgos";

const HomePage = (props) => {

    const [collapsed, setCollapsed] = useState(true);
    const {processAlgorithm} = useAlgos();
    const [code,setCode] = useState(null);

    const visualize = () => {
      
      const algo =  processAlgorithm();
      setCode(algo.toString());
    }


    const toggleSettings = () => setCollapsed(!collapsed);
    return (
        <>
            <div className="box">
                <Canvas />
                <Collapse horizontal
                    isOpen={!collapsed}
                    className="code-editor"
                    style={{ width: `${collapsed ? 0 : 28}%`, display:  !collapsed ? 'inline-block' : "none" }}
                >
                    <img src={collapseIcon} className="expand" alt="expand" onClick={toggleSettings} />
                    <CodeEditor code={code} />
                </Collapse>
                {collapsed && <img src={expandIcon} className="expand" alt="expand" onClick={toggleSettings} />}
            </div>
            <div className="button-wrapper">
                <Button color="primary" onClick={visualize}>
                    Visualize
                </Button>
            </div>
        </>
    );

}

export default HomePage;